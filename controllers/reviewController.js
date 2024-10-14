const Author = require("../models/authorModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const verifyToken = require("../utils");

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
    const { status, paper_id, comment, review_id } = req.body; // Assume the new status is sent in the request body
    const data = verifyToken(req?.headers["authorization"]?.split(" ")[1]);
    if (data) {
      // Update the status of the review where review_id matches the request
      const updated = await Author.update(
        { status: status, keywords: comment }, // The status to be updated
        { where: { id: paper_id } } // Where clause to find the correct review
      );
      // create new entry
      const review = await Review.create({
        reviewer_id: data.user_id,
        paper_id: paper_id,
      });

      // Check if the update was successful
      if (updated[0] === 0) {
        return res
          .status(404)
          .json({ message: "Review not found or no changes made" });
      }

      // Send a success message if the status was updated
      res.json({ message: "Review status updated successfully" });
    } else {
      res.status(500).json({ message: "Error Token not given", error });
    }
  } catch (error) {
    // Catch and handle any errors
    res.status(500).json({ message: "Error updating review status", error });
  }
};

exports.getPublishPaper = async (req, res) => {
  console.log("Hear.....................................");
  const data = verifyToken(req?.headers["authorization"]?.split(" ")[1]);
  if (data) {
    const reviews = await Review.findAll({
      where: { reviewer_id: data.user_id },
      attributes: ["paper_id"],
    });

    // If no reviews found for this author
    if (!reviews.length) {
      return res
        .status(200)
        .json({ message: "No reviews found for the given author" });
    }

    // Step 2: Extract the paper_ids from the result
    const paperIds = reviews.map((review) => review.paper_id);

    const filer_status = req.params;
    console.log(filer_status);

    // Step 3: Fetch from the Author table where paper_id is in paperIds and status is 'published'
    const publishedPapers = await Author.findAll({
      where: {
        id: paperIds,
        status: filer_status.status,
      },
      include: [
        {
          model: User, // Adjust this based on your Paper model definition
          attributes: ["id", "username"], // Include attributes you want from Paper
        },
      ],
    });

    res.status(200).json(publishedPapers);
  } else {
    res.json(500);
  }
};
