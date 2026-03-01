const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;