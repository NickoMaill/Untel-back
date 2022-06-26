// LIBRARY IMPORTS
const bcrypt = require("bcrypt");
const { okStatus, errorStatus, forbiddenStatus } = require("../@managers/logManager");

// LOG WITH PASSWORD
const login = async (req, res) => {
	const decodeHash = await bcrypt.compare(req.body.password, process.env.APP_ADMIN_PASS);

	try {
		decodeHash;
		if (decodeHash === false) {
			res.status(401).json({
				success: false,
				goodPassword: false,
				message: "wrong credentials",
			});
			return forbiddenStatus(res.req.method, res.req.url, res.statusCode);
		}
		res.status(202).json({
			success: true,
			goodPassword: true,
			message: "access granted",
		});
		return okStatus(res.req.method, res.req.url, res.statusCode);
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened",
		});
		return errorStatus(res.req.method, res.req.url, res.statusCode);
	}
};

// SEND CONTACT EMAIL --> USED WHEN VISITORS WANTS TO CONTACT US
const ContactEmail = (_req, res) => {
	res.status(202).json({
		success: true,
		message: "email send",
	});
	return okStatus(res.req.method, res.req.url, res.statusCode);
};

module.exports = { login, ContactEmail };
