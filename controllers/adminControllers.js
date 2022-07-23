// LIBRARY IMPORTS
const bcrypt = require("bcrypt");
const { okStatus, errorStatus, forbiddenStatus } = require("../@managers/logManager");
const { sendContactEmail } = require("../utils/orderEmail");

// LOG WITH PASSWORD
const login = async (req, res) => {
	console.log("login");
	const decodeHash = await bcrypt.compare(req.body.password, process.env.APP_ADMIN_PASS).catch((err) => console.error(err));

	try {
		decodeHash;
		if (!decodeHash) {
			console.log("wrong");
			res.status(401).json({
				success: false,
				goodPassword: false,
				message: "wrong credentials",
			});
			return
		}
		res.status(200).json({
			success: true,
			goodPassword: true,
			message: "access granted",
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened",
		});
		return
	}
};

// SEND CONTACT EMAIL --> USED WHEN VISITORS WANTS TO CONTACT US
const contactEmail = (req, res) => {
	sendContactEmail(req.body.subject, req.body.messageBody, req.body.contactEmail);
	res.status(202).json({
		success: true,
		message: "email send",
	});
	return
};

module.exports = { login, contactEmail };
