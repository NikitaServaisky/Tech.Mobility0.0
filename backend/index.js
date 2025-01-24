const express = require("express");
const cors = require("cors");
const connectBD = require("./services/dataBase");
const authRoutes = require("./routes/authRoutes");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectBD();

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
