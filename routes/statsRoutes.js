const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

// Routes for statistics operations
router.get("/", statsController.getAllStats);
router.get("/:id", statsController.getStatsByAuthorId);
router.post("/", statsController.createStats);
router.put("/:id", statsController.updateStats);

module.exports = router;
