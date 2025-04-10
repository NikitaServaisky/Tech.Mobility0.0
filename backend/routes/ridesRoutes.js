const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getRides, createRide, getActiveRides, getRideHistory, acceptRide, cancelRide, rejectRide } = require("../controllers/ridesController");
const router = express.Router();

router.post("/", authMiddleware, createRide);
router.get("/", authMiddleware, getRides);
router.get("/active", authMiddleware, getActiveRides);
router.get("/history", authMiddleware, getRideHistory);
router.put("/:rideId/accept", authMiddleware, acceptRide);
router.put('/:rideId/cancel', authMiddleware, cancelRide);
router.put('/:rideId/reject',authMiddleware, rejectRide);

module.exports = router;
