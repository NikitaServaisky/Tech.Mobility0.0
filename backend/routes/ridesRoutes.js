const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getRides, getAvailableRides, createRide, getActiveRides, getRideHistory, acceptRide } = require("../controllers/ridesController");
const router = express.Router();

router.post("/", authMiddleware, createRide);
router.get("/", authMiddleware, getRides);
router.get("/available", getAvailableRides);
router.get("/active", authMiddleware, getActiveRides);
router.get("/history", authMiddleware, getRideHistory);
router.put("/:rideId/accept", authMiddleware, acceptRide);

module.exports = router;
