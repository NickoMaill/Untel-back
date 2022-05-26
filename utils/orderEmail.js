const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { dirname } = require("path");
const path = require("path");
const puppeteer = require("puppeteer");

const { SERVICE_MAIL, USER_MAIL, PASSWORD_MAIL } = process.env;

const transporter = nodemailer.createTransport({
	service: SERVICE_MAIL,
	auth: {
		user: USER_MAIL,
		pass: PASSWORD_MAIL,
	},
});

const hbsOptions = {
	viewEngine: {
		layoutsDir: path.resolve(__dirname, "../views/layouts"),
		partialDir: path.resolve(__dirname, "../views/partials"),
	},
	viewPath: path.resolve(__dirname, "../views"),
};

transporter.use("compile", hbs(hbsOptions));

const sendOrderMail = (to, firstName, lastName, orderId, address, clientEmail, orderDate, nameItem, price) => {
	const mailInfo = {
		from: USER_MAIL,
		to,
		subject: `confirmation de votre commande n° ${orderId} sur untel-officiel.fr`,
		template: "confirmationOrder",
		context: {
			orderId,
			clientName: firstName + " " + lastName,
			address: address.address_line_1,
			city: address.postal_code + " " + address.admin_area_2 + ", " + address.country_code,
			clientEmail,
			orderDate,
			nameItem,
			price: Math.floor(price / 1.2),
			subTotal: Math.floor(price / 1.2),
			tva: Math.floor(price - price / 1.2),
			total: price,
		},
	};
	transporter.verify((err, success) => {
		if (err) {
			return console.error(err);
		} else {
			return console.log("Server is ready to take your message", success);
		}
	});

	transporter.sendMail(mailInfo, (err, info) => {
		if (err) {
			return console.error(err);
		} else {
			return console.log("email send", info.response);
		}
	});
};

module.exports = sendOrderMail;
