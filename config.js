require('dotenv').config();
var config = {
  development: {
    mongodb: {
      url: "devadmin:hau2Opeef7Hoos8eeNgo@151.106.32.163:32030",
      name: "k1"
    },
    kafka:{
      host:"localhost",
      port:"9092"
    }
    
  },
  production: {
    mongodb: {
      url: process.env.DEV_MONGO_USERNAME + ":" + process.env.DEV_MONGO_PASSWORD + "@" +
          process.env.DEV_MONGO_HOST + ":" + process.env.DEV_MONGO_PORT,
          name: process.env.DEV_MONGO_NAME
      },
      kafka:{
        host: process.env.DEV_KAFKA_URL,
        port: process.env.DEV_KAFKA_PORT
      }
  },
   colo: {
    mongodb: {
      url: process.env.COLO_MONGO_USERNAME + ":" + process.env.COLO_MONGO_PASSWORD + "@" +
        process.env.COLO_MONGO_HOST + ":" + process.env.COLO_MONGO_PORT,
      name: process.env.COLO_MONGO_NAME
    },
    kafka:{
      host: process.env.COLO_KAFKA_URL,
      port: process.env.COLO_KAFKA_PORT
    }
  },
  uat: {
    mongodb: {
      url: process.env.UAT_MONGO_USERNAME + ":" + process.env.UAT_MONGO_PASSWORD + "@" +
        process.env.UAT_MONGO_HOST + ":" + process.env.UAT_MONGO_PORT,
      name: process.env.UAT_MONGO_NAME
    },
    kafka:{
      host: process.env.UAT_KAFKA_URL,
      port: process.env.UAT_KAFKA_PORT
    }
  },
};

  
  module.exports = config;
  
