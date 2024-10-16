const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel"); // Make sure to import User model

// Define Author model
const Author = sequelize.define(
  "Author",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    abstract: { type: DataTypes.STRING(255), allowNull: false },
    other_authors: { type: DataTypes.STRING(255), allowNull: false },
    referace: { type: DataTypes.STRING(255), allowNull: false },
    // abstract: { type: DataTypes.TEXT }, // Uncomment if you need an abstract field
    author_id: {
      type: DataTypes.INTEGER,
      references: { model: User, key: "id" }, // Ensure "User" matches the correct model/table name
    },
    submission_date: { type: DataTypes.DATE },
    file_path: { type: DataTypes.STRING(255) },
    keywords: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM("submitted", "reviewed", "published", "rejected"),
      allowNull: false,
    },
  },
  {
    tableName: "author", // Ensure the table name matches your database schema
  }
);
// Define the association
Author.belongsTo(User, { foreignKey: "author_id" });
module.exports = Author;
