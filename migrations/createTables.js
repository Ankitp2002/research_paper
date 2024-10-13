const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../models/userModel");
const Author = require("../models/authorModel");
const Review = require("../models/reviewModel");
const Stats = require("../models/statsModel");
const Backup = require("../models/backupModel");

(async () => {
  try {
    await sequelize.sync({ force: true }); // force: true drops and recreates tables
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error syncing the database:", error);
  }
})();
