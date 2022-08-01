// LIBRARY IMPORTS
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const { jsPDF } = require("jspdf");
const path = require('path');
const moment = require("moment");

// MANAGERS IMPORT
const logManagers = require("../@managers/logManager");

//UTILS IMPORTS
const currentDate = require("../utils/getCurrentDate");
const emailEngine = require("../utils/orderEmail");

// GET ALL ORDER FROM DB
const allOrders = async (_req, res) => {
	const orders = await Postgres.query("SELECT * FROM orders ORDER BY date_of_order DESC");

	try {
		orders;

		res.status(200).json({
			success: true,
			ordersCount: orders.rowCount,
			orders: orders.rows,
		});

		logManagers.info("getAllOrder", `all order successfully fetched`);
	} catch (err) {
		console.error(err);

		logManagers.error("getAllOrder", `an error happened while charging all order - error -> ${err.detail}`);

		res.status(400).json({
			success: false,
			message: "an error happened while charging orders",
			error: err,
		});
	}
};

// GET ORDER BY ID FROM DB
const orderById = async (req, res) => {
	const order = await Postgres.query("SELECT * FROM orders WHERE order_id = $1", [req.params.id]);

	try {
		order;

		res.status(200).json({
			success: true,
			order: order.rows,
		});

		logManagers.info("getOrderById", `order ${req.params.id} successfully fetched`);
	} catch (err) {
		console.error(err);

		logManagers.error("getAllOrder", `an error happened while charging order ${req.params.id} - error -> ${err.detail}`);

		res.status(400).json({
			success: false,
			message: "an error happened while charging the order",
			error: err,
		});
	}
};

// SEARCH ORDER BY QUERY
const queryOrder = async (req, res) => {
	const query = req.query;
	const queryLength = Object.keys(req.query).length;
	const orders = await Postgres.query("SELECT * FROM orders ORDER BY date_of_order DESC");

	try {
		if (queryLength < 1) {
			orders;
			res.status(200).json({
				success: true,
				ordersCount: orders.rowCount,
				orders: orders.rows,
			});
		} else {
			let sqlString = "";
			let formatQuery = "";
			let formatQueryKeys = "";

			for (queryKeys in query) {
				formatQueryKeys = queryKeys;
				switch (queryKeys) {
					case "address":
						formatQueryKeys = "address ->> 'address_line_1'";
						break;
					case "district":
						formatQueryKeys = "address ->> 'admin_area_1'";
						break;
					case "day":
						formatQueryKeys = `date_of_order ILIKE`;
						formatQuery = `'________${query[queryKeys]}%'`;
						break;
					case "month":
						formatQueryKeys = `date_of_order ILIKE`;
						formatQuery = `'_____${query[queryKeys]}%'`;
						break;
					case "year":
						formatQueryKeys = `date_of_order ILIKE`;
						formatQuery = `'${query[queryKeys]}%'`;
						break;
					case "date-interval":
						formatQueryKeys = `date_of_order`;
						formatQuery = `${query[queryKeys]}`;
						break;
					default:
						break;
				}

				if (isNaN(query[queryKeys]) === true) {
					if (queryKeys === "date-interval") {
						sqlString +=
							formatQueryKeys +
							" >= " +
							"'" +
							formatQuery.substring(0, 10) +
							"'" +
							" AND " +
							formatQueryKeys +
							" < " +
							"'" +
							formatQuery.substring(11, formatQuery.length) +
							"'" +
							" AND ";
					} else {
						formatQuery = `'${query[queryKeys]}'`;
						sqlString += formatQueryKeys.toLocaleLowerCase() + " = " + formatQuery + " AND ";
					}
				} else {
					if (queryKeys === "day" || queryKeys === "month" || queryKeys === "year") {
						sqlString += formatQueryKeys + " " + formatQuery + " AND ";
					} else {
						formatQuery = query[queryKeys];
						sqlString += formatQueryKeys.toLocaleLowerCase() + " = " + formatQuery + " AND ";
					}
				}
			}

			sqlString = sqlString.substring(0, sqlString.length - 4);

			const filteredClient = await Postgres.query(`SELECT * FROM orders WERE ${sqlString} ORDER BY date_of_order DESC`);

			res.json({
				success: true,
				ordersCount: filteredClient.rowCount,
				orders: filteredClient.rows,
			});

			logManagers.info("getOrderByQuery", `order successfully fetched by query`);
		}
	} catch (err) {
		console.error(err);

		logManagers.error("getAllOrder", `an error happened while charging order - error -> ${err.detail}`);

		res.status(400).json({
			success: false,
			message: "an error happened while charging orders",
			error: err,
		});
	}
};

// ADD AN ORDER TO THE DB
const addOrder = async (req, res) => {
	if (req.script) {
		return res.status(403).json({
			success: false,
			message: "an error happened",
		});
	}

	try {
		await Postgres.query("INSERT INTO orders (order_id, item_id, name_item, client_firstName, client_lastName, client_email, city, country, amount, currency, date_of_order, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
			[
				req.body.id,
				req.body.itemId,
				req.body.nameItem,
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

		emailEngine.sendOrderEmail(req.body.id, req.body.clientEmail, req.body.clientFirstName);

		res.status(201).json({
			success: true,
			message: "order added",
		});

		console.log("order added");
	} catch (err) {
		console.error(err);

		res.status(400).json({
			success: false,
			message: "ans error happened",
		});
	}
};

const downloadOrder = async (req, res) => {
	const order = await Postgres.query("SELECT * FROM orders WHERE order_id = $1", [req.params.id]);
	const orderData = order.rows[0];
	const doc = new jsPDF({
		filters: ["ASCIIHexEncode"],
		orientation: "p",
		unit: "mm",
		format: "a4",
		putOnlyUsedFonts: true,
	});

	if (order.rowCount === 0) {
		logManagers.error("downloadOrder", `an error happened while fetching order ${req.params.id}`)
		return res.status(404).sendFile(path.resolve(__dirname, '../views/404.html'))
	}

	moment.locale("fr");
	doc.setFontSize(12);

	doc.text(["Untel", "59 rue Caulaincourt", "75018 Paris", "France"], 15, 30, { align: "left" });
	doc.text([`${orderData.client_firstname}`, `${orderData.client_lastname}`], 195, 65, { align: "right" });

	doc.text(["Date de facture", "Numéros de facture"], 15, 80, { align: "left", lineHeightFactor: 2 });
	doc.text([`${moment(orderData.date_of_order).format("DD MMMM YYYY")}`, `${orderData.order_id}`], 195, 80, {
		align: "right",
		lineHeightFactor: 2,
	});

	let headerConfig = [
		{
			name: "description",
			prompt: "description",
			width: 210,
			align: "left",
			padding: 0,
		},
		{
			name: "prix",
			prompt: "prix",
			width: 30,
			align: "right",
			padding: 0,
		},
	];

	let data = [
		{ description: orderData.name_item, prix: `${orderData.amount - 2} €` },
		{ description: "frais de livraison", prix: `2 €` },
	];

	doc.table(15, 100, data, headerConfig);

	doc.text(["Total TTC"], 15, 140, { align: "left" });
	doc.text([`${orderData.amount} €`], 192, 140, { align: "right" });
	res.type("pdf").send(doc.output());
};

module.exports = { allOrders, orderById, queryOrder, addOrder, downloadOrder };
