var dotenv = require('dotenv');
var path = require('path');
const mysql2 = require('mysql2');

dotenv.config({path:'./config.env'})

module.exports = {
  "development": {
    "username": "root",
    "password": "booker18",
    "database": "database_development",
    "host": "127.0.0.1",
    "port" : "3306",
    "dialect": "mysql",
    "dialectModule" : mysql2
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port" : "3306",
    "dialect": "mysql",
    "dialectModule" : mysql2
  }
};
