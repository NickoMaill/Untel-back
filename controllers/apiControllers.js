const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const backup = require("../data/post.json");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const logManagers = require("../@managers/logManager")
const { okStatus, errorStatus, logger, logFormat } = require("../@managers/logManager");

const allData = async (_req, res) => {
	const gigs = await Postgres.query("SELECT * FROM gig_dates");
	const albums = await Postgres.query(
		"SELECT album_id, title, subtitle, release_date, photo_path, is_released FROM albums"
	);
	try {
		gigs;
		albums;
		res.status(200).json({
			success: true,
			gigs: gigs.rows,
			gigsCount: gigs.rowCount,
			albums: albums.rows,
			albumsCount: albums.rowCount,
		});
		logManagers.debug('firstDataDB', 'first data correctly fetched')
	} catch (err) {
		console.error(err);
		logManagers.error('firstDataDB', `an error happened when fetching datas - error details -> ${err.detail}`)
		res.status(400).json({
			success: false,
			message: "An error happened when fetching datas",
		});
	}
};

const instagram = async (req, res) => {
	const array = [];
	const data = await fetch(
		`https://instagram28.p.rapidapi.com/medias?user_id=15269823200&batch_size=50&rapidapi-key=${process.env.APP_API_INSTAKEY}`
	);
	const response = await data.json();

	try {
		response;
		if (res.statusCode === 429 || data.status === 429) {
			res.status(200).json(backup[0].data.user.edge_owner_to_timeline_media.edges);
			logManagers.debug("instagram", "get data from backup JSON")
		} else {
			array.push(response);
			fs.writeFile(__dirname + "/../data/post.json", JSON.stringify(array, null, 2), "utf-8", (err) => {
				if (err) console.error(err);
				console.log("file success update");
				logManagers.debug("instagram", "file success update")
			});
			res.status(200).json(array[0].data.user.edge_owner_to_timeline_media.edges);
			logManagers.debug("instagram", "data correctly fetched")
		}
	} catch (err) {
		console.error(err);
		logManagers.error("instagram", `error happened while charging post - error details -> ${err.detail}`)
		res.status(400).json({
			success: false,
			message: "an error happened whiles charging post",
		});
	}
};

module.exports = { instagram, allData };
