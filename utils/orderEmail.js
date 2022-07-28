const fetch = require("node-fetch");
const urlShortener = require('node-url-shortener');
const logManagers = require("../@managers/logManager");
const configManager = require("../@managers/configManager");
const env = configManager.configEnv;


const sendOrderEmail = (orderId, clientEmail, clientFirstName) => {
	const url = "https://api.sendinblue.com/v3/smtp/email";
	let shortUrl;
	urlShortener.short(`${env.APP_FRONT_BASE_URL}/orders/download-order/${orderId}`, (err, url) => {
		shortUrl = url
		if (err) logManagers.error("urlShortener", `an error happened while shortening url - error -> ${err}`)
	})
	const options = {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"api-key": env.APP_SENDINGBLUE_API_KEY,
		},
		body: JSON.stringify({
			sender: { name: "Untel", email: env.APP_USER_MAIL },
			to: [{ email: clientEmail, name: clientFirstName }],
			replyTo: { email: env.APP_USER_MAIL, name: "Untel" },
			htmlContent: `
			<html>
				<body>
					<h1>Merci pour votre commande !</h1><br/>
					<p>ton achat est tès important il permet de soutenir mon activité, comme ça je peux vous preparer du nouveau contenu !</p><br/>
					<span>tu peux telecharger ta facture en cliquant sur sce lien <a href="${shortUrl}">${shortUrl}</a></span> 		
				</body> 	
			</html>`,
			subject: `Merci pour votre commande n° ${orderId}`,
		}),
	};

	fetch(url, options)
		.then((res) => res.json())
		.then((json) => {
			console.log("email send");
			logManagers.info("sendOrderEmail", `email correctly send from ${email}`);
		})
		.catch((err) => {
			console.error("error:" + err);
			logManagers.error("sendOrderEmail", `error when sending email from ${email} - error -> ${err.detail}`);
		});
};

const sendContactEmail = (subject, message, email) => {
	console.log("enter unction");
	const url = "https://api.sendinblue.com/v3/smtp/email";
	const options = {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"api-key": env.APP_SENDINGBLUE_API_KEY,
		},
		body: JSON.stringify({
			sender: { name: "Untel", email: env.APP_USER_MAIL },
			to: [{ email: env.APP_USER_MAIL, name: "contact" }],
			replyTo: { email: env.APP_USER_MAIL, name: "Untel" },
			htmlContent: `
			<html>
				<body>
					<p>${message}</p><br/>
					<span style=''>ce message a été par ${email}</span> 		
				</body> 	
			</html>`,
			subject: subject,
		}),
	};

	fetch(url, options)
		.then((res) => res.json())
		.then((json) => {
			console.log("email send");
			logManagers.info("ContactEmail", `email correctly send from ${email}`);
		})
		.catch((err) => {
			console.error("error:" + err);
			logManagers.error("sendContactEmail", `error when sending email from ${email} - error details -> ${err.detail}`);
		});
};

module.exports = { sendOrderEmail, sendContactEmail };
