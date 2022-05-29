// LIBRARY IMPORT
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const { v4: uuidv4 } = require("uuid");

// GET ALL GIGS DATA

const allGigs = async (_req, res) => {
	const gigDate = await Postgres.query("SELECT * FROM orders ORDER BY date_of_order ASC");

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
};

// ADD A GIG TO THE DB
const addGig = async (req, res) => {
	try {
		await Postgres.query(
			"INSERT INTO gig_dates (event_id, place, city, country, date, event_link, added_at, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
			[uuidv4(), req.body.place, req.body.city, req.body.country, req.body.date, req.body.eventLink, new Date(), req.body.address,]
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
};

//UPDATE A GIG ON THE DB
const updateGig = async (req, res) => {
	try {
		await Postgres.query(
			"UPDATE gig_dates SET place = $1, city = $2, country = $3, date = $4, event_link = $5,  is_canceled = $6, updated_at = $7, address = $8 WHERE event_id = $9",
			[
				req.body.place,
				req.body.city,
				req.body.country,
				req.body.date,
				req.body.eventLink,
				req.body.isCanceled,
				new Date(),
				req.body.address,
				req.params.id,
			]
		);
		res.status(202).json({
			success: true,
			message: "gig updated",
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while updating gig data",
		});
	}
}

// DELETE A GIG FROM DB
const deleteGig = async (req, res) => {
	try {
		await Postgres.query("DELETE FROM gig_date WHERE gig_id = $1", [req.params.id]);
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "cannot delete gig date",
			error: err,
		});
	}
}
module.exports = { allGigs, addGig, updateGig, deleteGig };
