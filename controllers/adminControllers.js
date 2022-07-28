// LIBRARY IMPORTS
const bcrypt = require("bcrypt");
const { okStatus, errorStatus, forbiddenStatus } = require("../@managers/logManager");
const { sendContactEmail } = require("../utils/orderEmail");
const logManagers = require('../@managers/logManager')

// LOG WITH PASSWORD
const login = async (req, res) => {

	if (req.script) {
		return res.status(403).json({
			success: false,
			message: "an error happened",
		})
	}

	const decodeHash = await bcrypt.compare(req.body.password, process.env.APP_ADMIN_PASS).catch((err) => console.error(err));
	try {
		decodeHash;
		if (!decodeHash) {
			res.status(401).json({
				success: false,
				goodPassword: false,
				message: "wrong credentials",
			});
			logManagers.warn("AdminLogin", "User send wrong credentials");
			return;
		}
		res.status(200).json({
			success: true,
			goodPassword: true,
			message: "access granted",
		});
		logManagers.info("AdminLogin", `User correctly logged`);
		return;
		
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened",
		});
		logManagers.info("AdminLogin", `User correctly logged - error details -> ${err.detail}`);
		return;
	}
};

// SEND CONTACT EMAIL --> USED WHEN VISITORS WANTS TO CONTACT US
const contactEmail = (req, res) => {
	if (req.script) {
		return res.status(403).json({
			success: false,
			message: "an error happened",
		})
	}
	
	sendContactEmail(req.body.subject, req.body.messageBody, req.body.contactEmail);
	res.status(202).json({
		success: true,
		message: "email send",
	});
	logManagers.info("contactEmail", "Email correctly sended");
};

module.exports = { login, contactEmail };
