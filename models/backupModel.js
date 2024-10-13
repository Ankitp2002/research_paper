// models/backupModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Define Backup model
const Backup = sequelize.define(
  "Backup",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    backup_name: { type: DataTypes.STRING(255) },
    backup_file_path: { type: DataTypes.STRING(255) },
  },
  {
    tableName: "backup",
  }
);

module.exports = Backup;
