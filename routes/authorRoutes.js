const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/papers/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes for thesis operations
router.get("/paper/:status", authorController.getAllAuthorPaper);
router.delete("/paper/:id", authorController.deleteAuthorPaper);

// get paper base 64
router.post("/paper_b64", authorController.getAuthorPaper);

router.post(
  "/create",
  upload.single("file"),
  authorController.createAuthorPaper
);

router.post(
  "/paper/:id",
  upload.single("file"),
  authorController.updateAuthorPaper
);

module.exports = router;
