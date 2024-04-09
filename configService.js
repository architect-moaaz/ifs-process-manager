const configData = require("./config");

function checkNodeEnv() {
  var env = process.env.NODE_ENV || "development";
  var config = null;
  if (env.trim() == "development") {
    config = configData.development;
  } else if (env.trim() == "production") {
    config = configData.production;
  } else if (env.trim() == "colo") {
    config = configData.colo;
  } else {
    config = configData.uat;
  }
  return config;
}
module.exports = checkNodeEnv;
