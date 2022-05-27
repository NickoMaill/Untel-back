const limiter = require("express-rate-limit");
const logColor = require("../utils/logColors")

const apiLimiter = limiter({
	windowMs: 120 * 60 * 1000,
	max: 1,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (_req, res, next, _options) => {
		console.warn(logColor.FgYellow, "you've done too many request for this routes");
		res.status(429);
		next();
	},
});

module.exports = apiLimiter;
