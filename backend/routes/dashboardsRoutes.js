const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { howIsUser } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", authMiddleware, howIsUser);

module.exports = router