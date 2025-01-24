const express = require("express");
const { userLogin, registerDriver, registerCustomer, registerOrganization} = require("../controllers/authController");

const router = express.Router();

router.post("/login", userLogin);
router.post("/register/customer", registerCustomer);
router.post('/register/driver', registerDriver);
router.post('/register/organization', registerOrganization);

module.exports = router;
