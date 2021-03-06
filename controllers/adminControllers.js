// LIBRARY IMPORTS
const bcrypt = require("bcrypt");

// MANAGERS IMPORT
const logManagers = require("../@managers/logManager");
const configManager = require("../@managers/configManager.js");
const env = configManager.configEnv;

// UTILS IMPORT
const emailEngine = require("../modules/emailModule");

// LOG WITH PASSWORD
const login = async (req, res) => {
	if (req.script) {
		return res.status(403).json({
			success: false,
			message: "an error happened",
		});
	}

	const decodeHash = await bcrypt.compare(req.body.password, env.APP_ADMIN_PASS).catch((err) => logManagers.error("login.decodeHash", `an error happened when admin login - error -> ${JSON.stringify(err)}`));
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
		});
	}

	emailEngine.sendContactEmail(req.body.subject, req.body.messageBody, req.body.contactEmail);
	res.status(202).json({
		success: true,
		message: "email send",
	});
	logManagers.info("contactEmail", "Email correctly sended");
};

module.exports = { login, contactEmail };
