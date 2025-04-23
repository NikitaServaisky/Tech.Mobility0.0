const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).json({
            status: "error",
            message: "too many requests, please try again later.",
        });
    }
});

module.exports = {limiter}