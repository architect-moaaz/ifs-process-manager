const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const MongoClient = require("mongodb").MongoClient;

const checkNodeEnv = require("../configService");

var config = checkNodeEnv();

const {
  mongodb: { url, name },
} = config;

const connectionString = `mongodb://${url}`;

console.log("connected to the DB: " + connectionString);

mongoose.connect(connectionString, { useNewUrlParser: true });

router.get("/fetch/:userinfo", async function (req, res) {
  const client = new MongoClient(connectionString);
  let info = req.params["userinfo"];
  let workspace = req.headers.workspace;
  let appName = req.headers.app;
  const processId = req.headers.processid;
  const database = client.db(name);
  const collection = database.collection("processes");

  let page =
    req.query.page == undefined || req.query.page <= 0
      ? 1
      : parseInt(req.query.page);
  let size =
    req.query.size == undefined || req.query.size <= 0
      ? 10
      : parseInt(req.query.size);
  page = (page - 1) * size;

  if (typeof workspace !== "undefined" && workspace !== null) {
    let pipeline = [
      {
        $match: {
          processId: { $ne: null },
          $and: [
            {
              initiatedBy: info,
              workspace: workspace,
              app: appName,
            },
          ],
        },
      },
      {
        $project: {
          processId: "$processId",
          workspace: "$workspace",
          app: "$app",
          stages: "$userTasks",
          processName: "$information.processName",
          initiatedBy: "$initiatedBy",
          status: {
            $cond: {
              if: { $ne: ["$information.endDate", null] },
              then: "completed",
              else: "inprogress",
            },
          },
        },
      },
      {
        $addFields: {
          lastActioned: {
            $arrayElemAt: [
              {
                $map: {
                  input: {
                    $filter: {
                      input: "$stages",
                      cond: { $ifNull: ["$$this.outputs.ActorId", false] },
                    },
                  },
                  as: "stage",
                  in: "$$stage.outputs.ActorId",
                },
              },
              -1,
            ],
          },
        },
      },
    ];
    if (processId) {
      pipeline.push({
        $match: {
          processId: processId,
        },
      });
    }
    let countPipe = [...pipeline];
    let cursor = collection.aggregate(pipeline).skip(page).limit(size);
    let result = await cursor.toArray();
    if (result.length === 0) {
      return res.json({
        message: `There is no process data for app: ${appName}`,
      });
    } else {
      let data = await getTotalRecordsAndData(
        countPipe,
        result,
        page,
        size,
        collection
      );
      res.json(data);
    }
  } else {
    return res.status(400).json({ message: "Workspace name is missing" });
  }
});

async function getTotalRecordsAndData(pipeline, data, page, size, collection) {
  pipeline.push({
    $count: "totalRecords",
  });
  let responseBe = {};
  if (page === "0" || page === 0) {
    var cursor = collection.aggregate(pipeline);
    var result = await cursor.toArray();
    let totalCount = result[0].totalRecords;
    let totalPages = Math.ceil(totalCount / (size ? size : 10));
    let metaData = {};
    metaData["totalCount"] = totalCount;
    metaData["totalPages"] = totalPages;
    responseBe["metaData"] = metaData;
  }
  responseBe["data"] = data;
  return responseBe;
}

router.get("/time/:id", async function (req, res) {
  const client = new MongoClient(connectionString);
  fetchid = req.params["id"];
  const database = client.db(name);
  const collection = database.collection("processEvents");

  const info = collection
    .find({
      kogitoprocinstanceid: fetchid,
    })
    .project({ time: "$time" });
  res.json(await info.toArray());
});

module.exports = router;
