const Statistics = require("../models/statsModel");

// Get all statistics
exports.getAllStats = async (req, res) => {
  try {
    const stats = await Statistics.findAll();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving statistics", error });
  }
};

// Get statistics by author ID
exports.getStatsByAuthorId = async (req, res) => {
  try {
    const stats = await Statistics.findOne({
      where: { author_id: req.params.id },
    });
    if (!stats)
      return res.status(404).json({ message: "Statistics not found" });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving statistics", error });
  }
};

// Create statistics entry
exports.createStats = async (req, res) => {
  try {
    const stats = await Statistics.create(req.body);
    res.status(201).json(stats);
  } catch (error) {
    res.status(400).json({ message: "Error creating statistics", error });
  }
};

// Update statistics
exports.updateStats = async (req, res) => {
  try {
    const [updated] = await Statistics.update(req.body, {
      where: { stat_id: req.params.id },
    });
    if (!updated)
      return res.status(404).json({ message: "Statistics not found" });
    const updatedStats = await Statistics.findByPk(req.params.id);
    res.json(updatedStats);
  } catch (error) {
    res.status(400).json({ message: "Error updating statistics", error });
  }
};
