// models/statsModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Define Statistics model
const Statistics = sequelize.define(
  "Statistics",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Author_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Author",
        key: "id",
      },
    },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    downloads: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "statistics",
  }
);

module.exports = Statistics;
