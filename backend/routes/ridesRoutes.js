const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getRides,
  createRide,
  getActiveRides,
  getRideHistory,
  acceptRide,
  cancelRide,
  rejectRide,
  requestJoinRide,
  approveJoinRequest,
} = require("../controllers/ridesController");
const { createRideValidator } = require("../validators/ridesValidator");
const validate = require("../middlewares/ValidateRequestMidleware");
const router = express.Router();

router.post("/create-ride", authMiddleware, createRideValidator, validate, createRide);
router.get("/", authMiddleware, getRides);
router.get("/active", authMiddleware, getActiveRides);
router.get("/history", authMiddleware, getRideHistory);
router.put("/:rideId/accept", authMiddleware, acceptRide);
router.put("/:rideId/cancel", authMiddleware, cancelRide);
router.put("/:rideId/reject", authMiddleware, rejectRide);
router.post("/:rideId/request-join", authMiddleware, requestJoinRide);
router.put(
  "/:rideId/approve-temp/:tempPassengerId",
  authMiddleware,
  approveJoinRequest
);

module.exports = router;
