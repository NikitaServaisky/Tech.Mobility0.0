const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./services/dataBase");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

//limit requests
const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 100,
  message: "too many requests, please try again latter."
});
app.use(limiter);

// Connect to MongoDB
connectDB();

// Routes
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
