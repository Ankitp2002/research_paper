const Author = require("../models/authorModel");
const Review = require("../models/reviewModel");

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviews", error });
  }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving review", error });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: "Error creating review", error });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const [updated] = await Review.update(req.body, {
      where: { review_id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: "Review not found" });
    const updatedReview = await Review.findByPk(req.params.id);
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: "Error updating review", error });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const deleted = await Review.destroy({
      where: { review_id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};

exports.reviewPaperStatusUpdate = async (req, res) => {
  try {
    const { status, paper_id } = req.body; // Assume the new status is sent in the request body
    console.log(status);
    console.log(paper_id);

    // Update the status of the review where review_id matches the request
    const updated = await Author.update(
      { status: status }, // The status to be updated
      { where: { id: paper_id } } // Where clause to find the correct review
    );

    // Check if the update was successful
    if (updated[0] === 0) {
      return res
        .status(404)
        .json({ message: "Review not found or no changes made" });
    }

    // Send a success message if the status was updated
    res.json({ message: "Review status updated successfully" });
  } catch (error) {
    // Catch and handle any errors
    res.status(500).json({ message: "Error updating review status", error });
  }
};
