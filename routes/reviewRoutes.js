const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Routes for review operations
router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);
router.post("/register", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
router.post("/paper_review", reviewController.reviewPaperStatusUpdate);

module.exports = router;
