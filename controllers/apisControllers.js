const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const backup = require("../data/post.json");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { okStatus, errorStatus } = require("../@managers/logManager");

const allData = async (_req, res) => {
	const gigs = await Postgres.query("SELECT * FROM gig_dates");
	const albums = await Postgres.query("SELECT album_id, title, subtitle, release_date, photo_path, is_released FROM albums");

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
		okStatus(res.req.method, res.req.url, res.statusCode);
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "An error happened when fetching datas",
		});
		errorStatus(res.req.method, res.req.url, res.statusCode);
		
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
			if (req.query.start && req.query.end) {
				if (
					parseInt(req.query.start) < 0 ||
					parseInt(req.query.end) >= 50 ||
					isNaN(parseInt(req.query.end)) ||
					isNaN(parseInt(req.query.start))
					) {
						res.status(400).json({
							success: false,
							message: "your query is not valid, try number value up to 0 and down or equal 50 ",
						});
						errorStatus(res.req.method, res.req.url, res.statusCode)
					} else {
					console.log("JSON file rendered");
					res.status(200).json(
						backup[0].data.user.edge_owner_to_timeline_media.edges.slice(
							parseInt(req.query.start),
							parseInt(req.query.end)
						)
					);
					okStatus(res.req.method, res.req.url, res.statusCode);
				}
			} else {
				res.status(200).json(backup[0].data.user.edge_owner_to_timeline_media.edges.slice(0, 5));
				okStatus(res.req.method, res.req.url, res.statusCode);
			}
		} else {
			array.push(response);
			fs.writeFile(__dirname + '/../data/post.json', JSON.stringify(array, null, 2), "utf-8", (err) => {
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
				okStatus(res.req.method, res.req.url, res.statusCode);
			} else {
				res.status(200).json(array[0].data.user.edge_owner_to_timeline_media.edges.slice(0, 5));
				okStatus(res.req.method, res.req.url, res.statusCode);
			}
		}
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened whiles charging post",
		});
		errorStatus(res.req.method, res.req.url, res.statusCode);
	}
};

module.exports = { instagram, allData };
