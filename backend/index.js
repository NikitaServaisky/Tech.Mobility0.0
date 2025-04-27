const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./services/dataBase");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardsRoutes");
const ridesRoutes = require("./routes/ridesRoutes");
const driverRoutes = require("./routes/driverRoutes");
const { initializeSocket } = require("./services/socket");
require("dotenv").config();

const app = express();
const http = require("http");
const server = http.createServer(app); // Create the HTTP server

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://tech-mobility0-0.vercel.app/"],
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "too many requests, please try again later.",
});

// Exclude socket.io endpoints from rate limiting
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/socket.io/")) {
    return next();
  }
  return limiter(req, res, next);
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/rides", ridesRoutes);
app.use("/driver", driverRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Initialize socket.io on the HTTP server
initializeSocket(server);

// IMPORTANT: Start the HTTP server, not the Express app directly!
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
