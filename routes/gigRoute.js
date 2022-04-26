const express = require("express");
const route = express.Router();
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const { v4: uuidv4 } = require("uuid");
const currentDate = require("../utils/getCurrentDate");

route.get("/", async (_req, res) => {
	const gigDate = await Postgres.query("SELECT * FROM gig_dates");

	try {
		gigDate;
		res.status(200).json({
			success: true,
			gigDates: gigDate.rows,
			gigNb: gigDate.rowCount,
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "cannot get gig_data",
			error: err,
		});
	}
});

route.post("/add", async (req, res) => {
	try {
		await Postgres.query(
			"INSERT INTO gig_dates (event_id, place, city, country, date, event_link, added_at) VALUES($1, $2, $3, $4, $5, $6, $7)",
			[
				uuidv4(),
				req.body.place,
				req.body.city,
				req.body.country,
				req.body.date,
				req.body.event_link,
				currentDate("full"),
			]
		);
		res.status(201).json({
			success: true,
			message: "gig date added",
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "cannot add gig date",
			error: err,
		});
	}
});

route.delete("/delete", async (req, res) => {
	try {
		await Postgres.query("DELETE FROM gig_date WHERE gig_id = $1", [req.body.gigId]);
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "cannot delete gig date",
			error: err,
		});
	}
});

module.exports = route;
