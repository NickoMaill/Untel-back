// LIBRARY IMPORTS
const bcrypt = require("bcrypt");

// LOG WITH PASSWORD
const login = async (req, res) => {
	const decodeHash = await bcrypt.compare(req.body.password, process.env.ADMIN_PASS); //--> HASHED PASSWORD

	try {
		decodeHash;
		if (!decodeHash) {
			res.status(401).res.json({
				success: false,
				goodPassword: false,
				message: "wrong credentials",
			});
		}
		res.status(202).json({
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
	}
};

// SEND CONTACT EMAIL --> USED WHEN VISITORS WANTS TO CONTACT US
const sendContactEmail = (_req, res) => {
	res.status(202).json({
		success: true,
		message: "email send",
	});
};

module.exports = { login, sendContactEmail };
