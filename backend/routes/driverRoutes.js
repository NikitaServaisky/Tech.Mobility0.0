const express = require("express");
const { getAvailableRides } = require("../controllers/ridesController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/available-rides", authMiddleware, getAvailableRides);

module.exports = router;