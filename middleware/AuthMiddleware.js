const JWT = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("Token missing");
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_ACCESS_KEY);
    console.log("✅ Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
