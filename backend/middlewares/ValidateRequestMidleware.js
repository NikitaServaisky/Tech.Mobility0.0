const { validationResult } = require("express-validator");

const validateRequestMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "validation error",
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
            })),
        });
    }

    next();
}

module.exports = validateRequestMiddleware;