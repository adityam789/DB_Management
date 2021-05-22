const { Sequelize, DataTypes } = require("sequelize");
const config = require("./dbconfig");
const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize