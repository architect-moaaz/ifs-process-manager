const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const processRouter = require("./routes/processRoutes");

app.use("/processInformation", processRouter);

app.listen(31701, () => console.log("And server started on 31701"));
