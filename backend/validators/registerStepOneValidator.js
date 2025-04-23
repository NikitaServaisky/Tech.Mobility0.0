const { body } = require("express-validator");

exports.registerStepOneValidater = [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email"),
  
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  
    body("firstName")
      .notEmpty().withMessage("First name is required")
      .isString().withMessage("First name must be a string"),
  
    body("lastName")
      .notEmpty().withMessage("Last name is required")
      .isString().withMessage("Last name must be a string"),
  
    body("phone")
      .notEmpty().withMessage("Phone is required")
      .isMobilePhone().withMessage("Invalid phone number"),
  
    body("role")
      .notEmpty().withMessage("Role is required")
      .isIn(["customer", "driver", "organization"]).withMessage("Invalid role"),
  
    body("step")
      .equals("1").withMessage("This route only accepts step 1"),
  ];
  
