const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  console.log(req.body);
  const { username, password, email, role } = req.body;
  if (username && password && email && role) {
    // const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        username,
        password: password,
        email,
        role,
      });
      res.status(201).json({ user });
    } catch (error) {
      res.status(200).json({ error });
    }
  } else {
    res.status(400).json({
      error: "All fields (username, password, email, role) are required",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    // await bcrypt.compare(password, user.password_hash)
    if (!user || !(password === user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    let role = user.role;

    res.json({ token, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const { role } = req.params;

  try {
    // Fetch all users from the database
    const users = await User.findAll({
      where: { role }, // Filter by the role parameter
    });

    // Send the user data as a JSON response
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  try {
    const user = await User.findByPk(id); // Find the user by ID
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Handle case where user does not exist
    }

    await User.destroy({ where: { id } }); // Delete the user
    res.status(204).send(); // Send a No Content response after successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors that occur
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params; // Get the user ID from the request parameters
  const { username, email, password } = req.body; // Get new data from the request body

  try {
    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Handle case where user does not exist
    }

    // Update user details (you may want to hash the password before saving)
    await user.update({
      username,
      email,
      password, // Hash password if provided
    });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors that occur
  }
};

exports.loger_Details = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user data to the request object
    const data = { user_id: decoded.user_id, username: decoded.username };

    res.json({ data });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
