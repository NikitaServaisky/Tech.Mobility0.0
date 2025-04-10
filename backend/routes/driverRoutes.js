const express = require("express");
const { getAvailableRides, rejectRide, getDriverStats, } = require("../controllers/driverController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/available-rides", authMiddleware, getAvailableRides);

router.get('/stats/:driverId', authMiddleware, getDriverStats);

module.exports = router;