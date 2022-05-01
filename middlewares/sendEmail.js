const nodemailer = require("nodemailer");
const { SERVICE_MAIL, USER_MAIL, PASSWORD_MAIL } = process.env;

const transporter = nodemailer.createTransport({
	service: SERVICE_MAIL,
	host: "smtp-mail.outlook.com",
	secureConnection: false,
	port: 587,
	tls: {
		ciphers: "SSLv3",
	},
	auth: {
		user: USER_MAIL,
		pass: PASSWORD_MAIL,
	},
});

function sendEmail(req, res, next) {
	const mailInfo = {
		from: USER_MAIL,
		to: USER_MAIL,
		subject: req.body.subject,
		html:
			req.body.messageBody + `</br><p>cet email vous viens de l'adresse suivante : ${req.body.contactEmail}</p>`,
	};

	transporter.verify((err, success) => {
		if (err) {
			console.error(err);
			return res.status(400).json({
				success: false,
				message: "an error happened",
			});
		} else {
			return console.log("Server is ready to take our messages", success);
		}
	});
	transporter.sendMail(mailInfo, (err, info) => {
		if (err) {
			console.error(err);
			return res.status(400).json({
				success: false,
				message: "an error happened",
			});
		} else {
			return console.log("email send", info.response);
		}
	});

	next();
}

module.exports = sendEmail;
