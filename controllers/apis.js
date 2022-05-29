const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const backup = require("../data/post.json");
const fetch = require("node-fetch");
const fs = require("fs");

const allData = async (_req, res) => {
	const gigs = await Postgres.query("SELECT * FROM gig_dates");
	const albums = await Postgres.query("SELECT * FROM albums");

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
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "An error happened when fetching datas",
		});
	}
};

const instagram = async (_req, res) => {
	const array = [];
	const data = await fetch(
		`https://instagram28.p.rapidapi.com/medias?user_id=15269823200&batch_size=50&rapidapi-key=${process.env.INSTAKEY}`
	);
	const response = await data.json();

	if (res.statusCode === 429 || data.status === 429) {
		console.log("JSON file rendered");
		res.status(200).json(backup[0].data.user.edge_owner_to_timeline_media);
	} else {
		array.push(response);
		fs.writeFile("../data/post.json", JSON.stringify(array), "utf-8", (err) => {
			// if (err) throw err;
			console.log("file success update");
		});
		res.status(200).json(array[0].data.user.edge_owner_to_timeline_media);
	}
};

module.exports = { instagram, allData };
