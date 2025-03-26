const express = require("express");
const { userLogin, registerUser } = require("../controllers/authController");
const upload = require("../middlewares/multerMiddleware");
const router = express.Router();

router.post("/login", userLogin);

// ✅ Customer Registration (Step 1: No File, Step 2: Payment Info & Profile Picture)
router.post("/register/customer", (req, res, next) => {
    console.log("📩 Step 1 received:", req.body);
    next();
}, registerUser);

router.post("/register/customer/step2", upload.single("profilePicture"), (req, res, next) => {
    console.log("📂 Customer Step 2 File received:", req.file?.filename || "❌ No file uploaded");
    next();
}, registerUser);

// ✅ Driver Registration (Step 1: No File, Step 2: Driver License & Bank Details)
router.post("/register/driver", (req, res, next) => {
    console.log("📩 Driver Step 1 received:", req.body);
    next();
}, registerUser);

router.post("/register/driver/step2", upload.single("driverLicense"), (req, res, next) => {
    console.log("📂 Driver Step 2 File received:", req.file?.filename || "❌ No file uploaded");
    next();
}, registerUser);

// ✅ Organization Registration (Step 1: No File, Step 2: Business License & Tax ID)
router.post("/register/organization", (req, res, next) => {
    console.log("📩 Organization Step 1 received:", req.body);
    next();
}, registerUser);

router.post("/register/organization/step2", upload.single("businessLicense"), (req, res, next) => {
    console.log("📂 Organization Step 2 File received:", req.file?.filename || "❌ No file uploaded");
    next();
}, registerUser);

module.exports = router;
