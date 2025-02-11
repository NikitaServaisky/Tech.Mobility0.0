const express = require("express");
const { userLogin, registerDriver, registerCustomer, registerOrganization} = require("../controllers/authController");
const upload = require("../middlewares/multerMiddleware");
const router = express.Router();

router.post("/login", userLogin);
router.post("/register/customer", upload.single('profilePicture'), registerCustomer);
router.post('/register/driver', upload.single('driverLicense'), registerDriver);
router.post('/register/organization', upload.single("businessLicense"), registerOrganization);

module.exports = router;
