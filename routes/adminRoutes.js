const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const sendEmail = require("../middlewares/sendEmail");

route.post("/login", async (req, res) => {
	const decodeHash = await bcrypt.compare(req.body.password, process.env.ADMIN_PASS);

	try {
		decodeHash;
		if (!decodeHash) {
			res.status(401).res.json({
				success: false,
				goodPassword: false,
				message: "wrong credentials",
			});
		}
		res.status(202)
			.json({
				success: true,
				goodPassword: true,
				message: "access granted",
			})
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened",
		});
	}
});

route.post("/send-email", sendEmail, (req, res) => {
	console.log(req.body);
	res.status(202).json({
		success: true,
		message: "email send",
	});
});

module.exports = route;
