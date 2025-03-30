const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  // בתוך authMiddleware
  console.log("🛡️ Incoming auth header:", req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "access deniend" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET_WORD
    );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "invalid token" });
  }
};
