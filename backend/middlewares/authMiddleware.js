const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Incoming auth header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ messge: "Access denied. No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_WORD);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    return res.status(400).json({ message: "Invalid token" });
  }
};
