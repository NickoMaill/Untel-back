const fetch = require("node-fetch");
const { APP_USER_MAIL, APP_SENDINGBLUE_API_KEY, APP_API_BASE_URL } = process.env;

const sendOrderEmail = (orderId, clientEmail, clientFirstName) => {
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
			to: [{ email: clientEmail, name: clientFirstName }],
			replyTo: { email: APP_USER_MAIL, name: "Untel" },
			htmlContent: `
			<html>
				<body>
					<h1>Merci pour votre commande !</h1><br/>
					<p>ton achat est tès important il permet de soutenir mon activité, comme ça je peux vous preparer du nouveau contenu !</p><br/>
					<span>tu peux telecharger ta facture en cliquant sur sce lien <a href="${APP_API_BASE_URL}/orders/download-order/${orderId}">${APP_API_BASE_URL}/orders/download-order/${orderId}</a></span> 		
				</body> 	
			</html>`,
			subject: `Merci pour votre commande n° ${orderId}`,
		}),
	};

	fetch(url, options)
		.then((res) => res.json())
		.then((json) => console.log(json))
		.catch((err) => console.error("error:" + err));
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
		.then((json) => console.log(json))
		.catch((err) => console.error("error:" + err));
};

module.exports = { sendOrderEmail, sendContactEmail };
