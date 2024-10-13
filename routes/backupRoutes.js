const express = require("express");
const router = express.Router();
const backupController = require("../controllers/backupController");

// Routes for backup operations
router.get("/", backupController.getAllBackups);
router.get("/:id", backupController.getBackupById);
router.post("/", backupController.createBackup);

module.exports = router;
