const cors = (_req, res, next) => {
	// let origin;
	// if (req.headers.origin) {
	// 	origin = req.headers.origin;
	// }
	res.set("Access-Control-Allow-Origin", "http://localhost:3000/");
	res.set("Access-Control-Allow-Credentials", "true");
	res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.set("Access-Control-Expose-Headers", "Content-Length, X-JSON");
	res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Accept-Language, X-Authorization");
	res.set("Cache-Control", "s-maxage=86400", "stale-while-revalidate=180");
	next();
};

module.exports = cors;
