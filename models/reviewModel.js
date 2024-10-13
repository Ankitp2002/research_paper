const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Author = require("./authorModel");
const User = require("./userModel");

// Define Review model
const Review = sequelize.define(
  "Review",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    author_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Author, // Use the actual model object instead of a string
        key: "id",
      },
    },
    reviewer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User, // Use User model (not "Users", assuming your model is User)
        key: "id",
      },
    },
    comment: { type: DataTypes.TEXT },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    tableName: "reviews", // Ensure this matches your table name in the DB
  }
);

// Define associations
Review.belongsTo(Author, { foreignKey: "author_id" });
Review.belongsTo(User, { foreignKey: "reviewer_id" }); // The reviewer_id references the User model

module.exports = Review;
