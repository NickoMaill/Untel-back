const express = require("express");
const route = express.Router();
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const { v4: uuidv4 } = require("uuid");
const currentDate = require("../utils/getCurrentDate");
const sendOrderMail = require("../utils/orderEmail");

route.get("/all", async (req, res) => {
	const orders = await Postgres.query("SELECT * FROM orders ORDER BY date_of_order DESC");
	try {
		orders;
		res.status(200).json({
			success: true,
			orders: orders.rows,
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while charging orders",
		});
	}
});

route.get("/:id", async (req, res) => {
	const order = await Postgres.query("SELECT * FROM orders WHERE order_id = $1", [req.params.id]);

	try {
		order;
		res.status(200).json({
			success: true,
			order: order.rows,
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while charging the order",
		});
	}
});

route.post("/add-order", async (req, res) => {
	const formatName = req.body.nameItem.toLowerCase().replace(/ /g, "-");
	try {
		await Postgres.query(
			"INSERT INTO orders (order_id, item_id, name_item, client_firstName, client_lastName, client_email, city, country, amount, currency, date_of_order, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
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
				req.body.address,
			]
		);
		sendOrderMail("nicomaillols@gmail.com", req.body.clientFirstName, req.body.id);
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
