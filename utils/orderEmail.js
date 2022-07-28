const fetch = require("node-fetch");
const { APP_USER_MAIL, APP_SENDINGBLUE_API_KEY, APP_API_BASE_URL } = process.env;
const logManagers = require("../@managers/logManager");
const urlShortener = require('node-url-shortener');


const sendOrderEmail = (orderId, clientEmail, clientFirstName) => {
	const url = "https://api.sendinblue.com/v3/smtp/email";
	let shortUrl;
	urlShortener.short(`${APP_API_BASE_URL}/orders/download-order/${orderId}`, (err, url) => {
		shortUrl = url
		if (err) logManagers.error("urlShortener", `an error happened while shortening url - error -> ${err}`)
	})
	const options = {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"api-key": APP_SENDINGBLUE_API_KEY,
		},
		body: JSON.stringify({
			sender: { name: "Untel", email: APP_USER_MAIL },
			to: [{ email: clientEmail, name: clientFirstName }],
			replyTo: { email: APP_USER_MAIL, name: "Untel" },
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
			"api-key": APP_SENDINGBLUE_API_KEY,
		},
		body: JSON.stringify({
			sender: { name: "Untel", email: APP_USER_MAIL },
			to: [{ email: APP_USER_MAIL, name: "contact" }],
			replyTo: { email: APP_USER_MAIL, name: "Untel" },
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
