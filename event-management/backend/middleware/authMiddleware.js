const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  // Check whether the token exists
  if (!header) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  // Check Bearer token format
  const parts = header.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({
      message: "Invalid token format"
    });
  }

  const token = parts[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, "secretkey");

    // Extract user ID
    const userId = decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token: user ID missing"
      });
    }

    // Store authenticated user information
    req.user = {
      id: userId,
      role: decoded.role || "user"
    };

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;