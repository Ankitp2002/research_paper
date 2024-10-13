const Author = require("../models/authorModel");
const path = require("path");
const fs = require("fs");
const User = require("../models/userModel");
// Get all author
exports.getAllAuthorPaper = async (req, res) => {
  const filer_status = req.params;

  if (filer_status?.status == "excluded") {
    filer_status.status = ["submitted", "reviewed3"];
  }
  try {
    // Use the appropriate method to find authors by status
    const authors = await Author.findAll({
      where: filer_status,
      include: [
        {
          model: User, // Adjust this based on your Paper model definition
          attributes: ["id", "username"], // Include attributes you want from Paper
        },
      ],
    }); // Adjust based on your ORM

    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving authors", error });
  }
};

// Get a author by ID
exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ message: "Author not found" });
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving author", error });
  }
};

// Create a new author
exports.createAuthorPaper = async (req, res) => {
  try {
    const { title, author_id, status } = req.body;
    const file = req.file;
    // Get the file from the request

    if (!file) {
      return res.status(400).json({ message: "File is required......" });
    }

    const upload_path = path.join(__dirname, "../uploads/papers/"); // Path to save the file

    // Ensure the 'uploads' directory exists
    if (!fs.existsSync(upload_path)) {
      fs.mkdirSync(upload_path, { recursive: true });
    }
    const filePath = path.join(upload_path, file.filename);
    try {
      // Create the paper record in the database
      const paper = await Author.create({
        title,
        author_id,
        file_path: filePath, // Store the relative path to the file
        status,
      });

      res.status(201).json(paper);
    } catch (error) {
      console.error("Error saving to database:", error);
      res.status(500).json({ message: "Error saving to database", error });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error processing request", error });
  }
};

// Update a author
exports.updateAuthorPaper = async (req, res) => {
  try {
    const [updated] = await Author.update(req.body, {
      where: { author_id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: "Author not found" });
    const updatedAuthor = await Author.findByPk(req.params.id);
    res.json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ message: "Error updating author", error });
  }
};

// Delete a author
exports.deleteAuthorPaper = async (req, res) => {
  const paper_id = req.params;
  try {
    const deleted = await Author.destroy({
      where: paper_id,
    });
    if (!deleted)
      return res.status(404).json({ message: "Author Paper not found" });
    res.json({ message: "Author Paper deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error deleting author", error });
  }
};

exports.getAuthorPaper = async (req, res) => {
  try {
    // Step 1: Find the author by ID
    const author = await Author.findOne({ where: { id: req.body.id } }); // Adjust based on your ORM
    console.log(author);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Step 2: Get the file path from the author record
    const filePath = author.file_path; // Adjust this based on your model's structure

    // Step 3: Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Step 4: Read the file and convert it to Base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString("base64");

    // Step 5: Return the Base64 string
    res.json({ file: base64File });
  } catch (error) {
    console.error("Error retrieving author paper:", error);
    res.status(500).json({ message: "Error retrieving author paper", error });
  }
};
