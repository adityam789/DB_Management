const sequel = require("./sequelize");
const { Sequelize, DataTypes } = require("sequelize");
const Events = sequel.define(
  "Events",
  {
    // Model attributes are defined here
    EventTypeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventState:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    // Other model options go here
  }
);

module.exports = sequel;

// const tableModel = {
//     {
//         // Model attributes are defined here
//         EventTypeName: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         }
//     }
// }
