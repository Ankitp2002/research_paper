const jwt = require("jsonwebtoken");

function verifyToken(token) {
  try {
    // Verify the token using JWT_SECRET from the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Return the user data extracted from the token
    return { user_id: decoded.user_id, username: decoded.username };
  } catch (error) {
    // Handle token verification errors
    return {};
  }
}

module.exports = verifyToken;
