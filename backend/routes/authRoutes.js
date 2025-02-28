const express = require("express");
const { userLogin, registerUser} = require("../controllers/authController");
const upload = require("../middlewares/multerMiddleware");
const router = express.Router();

router.post("/login", userLogin);
router.post("/register", upload.single('file'), registerUser);

module.exports = router;
