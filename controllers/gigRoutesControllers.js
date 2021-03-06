// LIBRARY IMPORT
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const { v4: uuidv4 } = require("uuid");

// MANAGERS IMPORT
const logManagers = require("../@managers/logManager");

// GET ALL GIGS DATA

const allGigs = async (_req, res) => {
	const gigDate = await Postgres.query("SELECT * FROM gig_dates ORDER BY date DESC");

	try {
		gigDate;
		res.status(200).json({
			success: true,
			gigDates: gigDate.rows,
			gigNb: gigDate.rowCount,
		});
		logManagers.info("getAllGigs", `all gigs data success loaded`);
	} catch (err) {
		console.error(err);
		logManagers.error("getAllGigs", `an error happened when charging gig datas - error details -> ${err.detail}`);
		res.status(400).json({
			success: false,
			message: "cannot get gig_data",
			error: err,
		});
	}
};

const gigById = async (req, res) => {
	const gig = await Postgres.query("SELECT * FROM gig_dates WHERE event_id = $1", [req.params.id])

	try {
		gig;
		res.json({
			success: true,
			gigDate: gig.rows,
		})
	} catch (err) {
		console.error(err);
		logManagers.error("gigById", `an error happened while charging gigDate ${req.params.id} - error - ${JSON.stringify(err)}`)
		res.json({
			success: false,
			message: "cannot get gig",
			error: err,
		})
	}
}

// ADD A GIG TO THE DB
const addGig = async (req, res) => {
	const id = uuidv4();

	if (req.script) {
		return res.status(403).json({
			success: false,
			message: "an error happened",
		});
	}
	
	try {
		await Postgres.query(
			"INSERT INTO gig_dates (event_id, place, city, country, date, event_link, added_at, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
			[
				id,
				req.body.place,
				req.body.city,
				req.body.country,
				req.body.date,
				req.body.eventLink,
				new Date(),
				req.body.address,
			]
		);
		res.status(201).json({
			success: true,
			message: "gig date added",
		});
		logManagers.info("updateGig", `gig ${id} successfully added`);
	} catch (err) {
		console.error(err);
		logManagers.error("getAllGigs", `an error happened while adding gig - error details -> ${err.detail}`);
		res.status(400).json({
			success: false,
			message: "cannot add gig date",
			error: err,
		});
	}
};

//UPDATE A GIG ON THE DB
const updateGig = async (req, res) => {
	if (req.script) {
		return res.status(403).json({
			success: false,
			message: "an error happened",
		});
	}

	console.log(req.params.id);
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
		console.log("gig updated");
		logManagers.info("updateGig", `gig ${req.params.id} successfully updated`);
	} catch (err) {
		console.error(err);
		logManagers.error("getAllGigs", `an error happened while updating gig ${req.params.id}- error details -> ${err.detail}`);
		res.status(400).json({
			success: false,
			message: "an error happened while updating gig data",
			error: err,
		});
		console.log("an error happened while updating gig data");
	}
};

// DELETE A GIG FROM DB
const deleteGig = async (req, res) => {
	try {
		await Postgres.query("DELETE FROM gig_date WHERE gig_id = $1", [req.params.id]);
		logManagers.info("deleteGig", `gig ${req.params.id} successfully deleted`);
	} catch (err) {
		console.error(err);
		logManagers.error("deleteGig", `an error happened while deleting gig ${req.params.id} - error details -> ${err.detail}`);
		res.status(400).json({
			success: false,
			message: "cannot delete gig date",
			error: err,
		});
	}
};
module.exports = { allGigs, gigById, addGig, updateGig, deleteGig };
