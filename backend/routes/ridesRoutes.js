const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getRides, getAvailableRides, createRide } = require("../controllers/ridesController");
const router = express.Router();

router.get("/", authMiddleware, getRides);
router.get("/available", getAvailableRides);
router.post("/", authMiddleware, createRide);

module.exports = router;
