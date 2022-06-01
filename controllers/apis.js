const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const backup = require("../data/post.json");
const fetch = require("node-fetch");
const fs = require("fs");
const req = require("express/lib/request");

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

const instagram = async (req, res) => {
	const array = [];
	const data = await fetch(
		`https://instagram28.p.rapidapi.com/medias?user_id=15269823200&batch_size=50&rapidapi-key=${process.env.INSTAKEY}`
	);
	const response = await data.json();
	try {
		response;
		if (res.statusCode === 429 || data.status === 429) {
			if (req.query.start && req.query.end) {
				if (
					parseInt(req.query.start) < 0 ||
					parseInt(req.query.end) >= 50 ||
					isNaN(parseInt(req.query.end)) ||
					isNaN(parseInt(req.query.start))
					) {
						res.status(400).json({
							success: false,
							message: "your query is not valid, try number value > 0 or <= 50 ",
						});
					} else {
					console.log("JSON file rendered");
					res.status(200).json(
						backup[0].data.user.edge_owner_to_timeline_media.edges.slice(
							parseInt(req.query.start),
							parseInt(req.query.end)
						)
					);
				}
			} else {
				res.status(200).json(backup[0].data.user.edge_owner_to_timeline_media.edges);
			}
		} else {
			array.push(response);
			fs.writeFileSync("../data/post.json", JSON.stringify(array), "utf-8", (err) => {
				if (err) throw err;
				console.log("file success update");
			});
			if (req.query.start && req.query.end) {
				res.status(200).json(
					backup[0].data.user.edge_owner_to_timeline_media.edges.slice(
						parseInt(req.query.start),
						parseInt(req.query.end)
					)
				);
			} else {
				res.status(200).json(backup[0].data.user.edge_owner_to_timeline_media.edges);
			}
		}
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened whiles charging post",
		});
	}
};

module.exports = { instagram, allData };
