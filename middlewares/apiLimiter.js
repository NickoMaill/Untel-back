// LIBRARY IMPORT
const limiter = require("express-rate-limit");
const path = require("path");

// UTILS IMPORT
const logColor = require("../utils/logColors");

const instaLimiter = limiter({
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

const serverLimiter = limiter({
	windowMs: 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (_req, res, next) => {
		console.warn("you've done too many requests...");
		res.status(403).sendFile()
		next();
		
	}
});

module.exports = { instaLimiter, serverLimiter };
