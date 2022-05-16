const cors = (req, res, next) => {
	let origin;
	if (req.headers.origin) {
		origin = req.headers.origin
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	res.setHeader("X-Powered-By", "Express")
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-type, Accept");
	res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
	next();
};

module.exports = cors;
