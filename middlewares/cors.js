const cors = (_req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PUT", "PATCH", "DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-type, Accept");
	next();
};

module.exports = cors;
