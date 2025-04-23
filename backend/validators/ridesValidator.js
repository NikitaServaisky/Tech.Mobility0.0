const { body } = require("express-validator");

exports.createRideValidator = [
  // 🧍 User ID 
  body("userId")
    .notEmpty().withMessage("User ID is required")
    .isMongoId().withMessage("Invalid user ID"),

  // 🏁 Location adress
  body("from")
    .notEmpty().withMessage("Pickup location is required")
    .isString().withMessage("Pickup must be a string"),

  // 🎯 Destination adress
  body("destination")
    .notEmpty().withMessage("Dropoff location is required")
    .isString().withMessage("Dropoff must be a string"),

  // 🗓 זמן עתידי (אופציונלי – אם יש זמן מוזמן מראש)
  body("scheduledTime")
    .optional()
    .isISO8601().withMessage("Scheduled time must be a valid date"),

  // 🧭 קואורדינטות – אופציונלי אבל אם קיימים, נבדוק טיפוס
  body("pickupCoords.lat")
    .optional()
    .isNumeric().withMessage("Pickup latitude must be a number"),

  body("pickupCoords.lon")
    .optional()
    .isNumeric().withMessage("Pickup longitude must be a number"),

  body("destinationCoords.lat")
    .optional()
    .isNumeric().withMessage("Destination latitude must be a number"),

  body("destinationCoords.lon")
    .optional()
    .isNumeric().withMessage("Destination longitude must be a number"),
];
