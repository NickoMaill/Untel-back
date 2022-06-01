const cors = (req, res, next) => {
	let origin;
	if (req.headers.origin) {
		origin = req.headers.origin;
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.setHeader("Access-Control-Expose-Headers", "Content-Length, X-JSON");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Accept-Language, X-Authorization");
	res.setHeader("Cache-Control", "s-maxage=86400", "stale-while-revalidate=180");
	next();
};

module.exports = cors;
