const express = require("express");
const { userLogin, registerUser } = require("../controllers/authController");
const upload = require("../middlewares/multerMiddleware");
const router = express.Router();
const { loginValidater } = require("../validators/loginValidator");
const {
  registerStepOneValidater,
} = require("../validators/registerStepOneValidator");
const {
  driverStepTwoValidator,
  customerStepTwoValidator,
} = require("../validators/registerStepTwoValidator");
const validate = require("../middlewares/ValidateRequestMidleware");

router.post("/login", loginValidater, validate, userLogin);

// ✅ Customer Registration (Step 1: No File, Step 2: Payment Info & Profile Picture)
router.post(
  "/register/customer",
  registerStepOneValidater,
  validate,
  (req, res, next) => {
    console.log("📩 Step 1 received:", req.body);
    next();
  },
  registerUser
);

router.post(
  "/register/customer/step2",
  upload.single("profilePicture"),
  customerStepTwoValidator,
  validate,
  (req, res, next) => {
    console.log(
      "📂 Customer Step 2 File received:",
      req.file?.filename || "❌ No file uploaded"
    );
    next();
  },
  registerUser
);

// ✅ Driver Registration (Step 1: No File, Step 2: Driver License & Bank Details)
router.post(
  "/register/driver",
  registerStepOneValidater,
  validate,
  (req, res, next) => {
    console.log("📩 Driver Step 1 received:", req.body);
    next();
  },
  registerUser
);

router.post(
  "/register/driver/step2",
  upload.fields([
    { name: "driverLicense", maxCount: 1 },
    { name: "vehiclePhoto", maxCount: 1 },
  ]),
  driverStepTwoValidator,
  validate,
  (req, res, next) => {
    console.log("📂 Driver Step 2 Files:", req.files);
    next();
  },
  registerUser
);

// ✅ Organization Registration (Step 1: No File, Step 2: Business License & Tax ID)
router.post(
  "/register/organization",
  registerStepOneValidater,
  validate,
  (req, res, next) => {
    console.log("📩 Organization Step 1 received:", req.body);
    next();
  },
  registerUser
);

router.post(
  "/register/organization/step2",
  upload.single("businessLicense"),
  (req, res, next) => {
    console.log(
      "📂 Organization Step 2 File received:",
      req.file?.filename || "❌ No file uploaded"
    );
    next();
  },
  registerUser
);

module.exports = router;
