const { body } = require("express-validator");

// ולידציה ללקוח - שלב 2
exports.customerStepTwoValidator = [
  body("userId")
    .notEmpty().withMessage("User ID is required")
    .isMongoId().withMessage("Invalid user ID"),

  body("cardHolderName")
    .notEmpty().withMessage("Card holder name is required")
    .isString().withMessage("Card holder name must be a string"),

  body("cardNumber")
    .notEmpty().withMessage("Card number is required")
    .isCreditCard().withMessage("Invalid card number"),

  body("expiryDate")
    .notEmpty().withMessage("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/).withMessage("Expiry date must be in MM/YY format"),

  body("cvv")
    .notEmpty().withMessage("CVV is required")
    .isLength({ min: 3, max: 4 }).withMessage("CVV must be 3 or 4 digits")
    .isNumeric().withMessage("CVV must be numeric"),
];


// ולידציה לנהג - שלב 2
exports.driverStepTwoValidator = [
  body("userId")
    .notEmpty().withMessage("User ID is required")
    .isMongoId().withMessage("Invalid user ID"),

  body("extraData").notEmpty().withMessage("Missing driver details (extraData)"),

  body("extraData.driverDetails.licenseNumber")
    .notEmpty().withMessage("License number is required"),

  body("extraData.driverDetails.vehicleMake")
    .notEmpty().withMessage("Vehicle make is required"),

  body("extraData.driverDetails.vehicleModel")
    .notEmpty().withMessage("Vehicle model is required"),

  body("extraData.driverDetails.vehicleYear")
    .notEmpty().withMessage("Vehicle year is required")
    .isInt({ min: 1900, max: 2100 }).withMessage("Invalid vehicle year"),

  body("extraData.driverDetails.vehiclePlate")
    .notEmpty().withMessage("Vehicle plate is required"),

  body("extraData.driverDetails.vehicleColor")
    .notEmpty().withMessage("Vehicle color is required"),

  body("extraData.driverDetails.bankName")
    .notEmpty().withMessage("Bank name is required"),

  body("extraData.driverDetails.branchNumber")
    .notEmpty().withMessage("Branch number is required"),

  body("extraData.driverDetails.accountOwner")
    .notEmpty().withMessage("Bank account owner is required"),
];
