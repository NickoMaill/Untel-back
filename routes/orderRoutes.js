const express = require("express");
const route = express.Router();
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const { v4: uuidv4 } = require("uuid");
const currentDate = require("../utils/getCurrentDate");

route.post("/", async (req, res) => {
	const formatName = req.body.nameItem.toLowerCase().replace(/ /g, "-");
	try {
		await Postgres.query(
			"INSERT INTO orders (order_id, item_id, name_item, client_firstName, client_lastName, client_email, city, country, amount, currency, date_of_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
			[
				req.body.id,
				req.body.itemId,
				formatName,
				req.body.clientFirstName,
				req.body.clientLastName,
				req.body.clientEmail,
				req.body.city,
				req.body.country,
				parseFloat(req.body.amount),
				req.body.currency,
				currentDate("full"),
			]
		);
		res.status(201).json({
			success: true,
			message: "order added",
		});

		console.log("order added");
	} catch (err) {
		res.status(400).json({
			success: false,
			message: "ans error happened",
		});
		console.error(err);
	}
});

module.exports = route;
