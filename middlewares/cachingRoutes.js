const NodeCache = require("node-cache");
const { FgYellow, FgGreen, FgRed } = require("../utils/logColors");

const cache = new NodeCache({ stdTTL: 43200, checkperiod: 10  });

const duration = (req, res, next) => {
	if (req.method !== "GET") {
		console.error(FgRed, "Cannot cache non-GET methods!");
		return next();
	}

	const key = req.originalUrl;
	const cachedResponse = cache.get(key);

	if (cachedResponse) {
		console.log(FgGreen, `Cache hit for ${key}`);
		res.json(JSON.parse(cachedResponse));
	} else {
		console.log(FgYellow, `Cache miss for ${key}`);
		res.originalSend = res.send;
		res.send = (body) => {
			res.originalSend(body);
			cache.set(key, body, duration);
		};
		next();
	}
};

module.exports = duration;
