'use strict';
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
dotenv.config( { path : './config.env'} )
const env = process.env.NODE_ENV 
//|| 'development';
const config = require('../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config, {
    dialectOptions: {
      connectTimeout: 30000 
    }
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config, {
    dialectOptions: {
      connectTimeout: 30000 
    }
  });
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('การเชื่อมต่อกับฐานข้อมูลสำเร็จแล้ว');
    console.log(`Connected to host: ${sequelize.options.host}`);
  } catch (error) {
    console.error('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้:', error);
  }
})();
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;