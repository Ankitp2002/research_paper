const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "author", "reviewer", "user"),
      allowNull: false,
    },
  },
  {
    tableName: "users", // Ensure this matches the referenced table in other models
  }
);

module.exports = User;
