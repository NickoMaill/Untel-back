const express = require("express");
const route = express.Router();
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer({ dest: "public/uploads" });
const fs = require("fs");
const path = require("path");
const currentDate = require("../utils/getCurrentDate");

route.get("/", async (_req, res) => {
	const albums = await Postgres.query("SELECT * FROM albums");
	try {
		albums;
		res.status(200).json({
			success: true,
			albums: albums.rows,
		});
	} catch (err) {
		console.error(err);
		res.json({
			success: false,
			message: "an error happened when fetching datas",
		});
	}
});

route.post("/add-album", upload.single("image"), async (req, res) => {
	let type = path.extname(req.file.originalname);
	let fileName = `${req.body.title.toLowerCase()}-${currentDate("date")}${type}`;

	try {
		await Postgres.query(
			"INSERT INTO albums (album_id, title, year, description, playlist_link, video_link, photos_paths, color, is_released) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
			[
				uuidv4(),
				req.body.title,
				req.body.year,
				req.body.description,
				req.body.playlistLink,
				req.body.videoLink,
				`${req.file.destination}/${fileName}`,
				req.body.color,
				req.body.isReleased,
			]
		);
		fs.renameSync(req.file.path, path.join(req.file.destination, `${fileName}`));
		res.status(201).json({
			success: true,
			message: "album added",
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened when add an album",
		});
	}
});

route.put("/update-album/:id", async (req, res) => {
	try {
		await Postgres.query(
			"UPDATE albums SET title = $1, year = $2, description = $3, playlist_link = $4, video_link = $5,  color = $6, is_released = $7 WHERE album_id = $8",
			[
				req.body.title,
				req.body.year,
				req.body.description,
				req.body.playlistLink,
				req.body.videoLink,
				`${req.file.destination}/${fileName}`,
				req.body.color,
				req.body.isReleased,
				uuidv4(),
			]
		);
		res.status(202).json({
			success: true,
			message: "album updated",
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while updating album data",
		});
	}
});

route.delete("/delete", async (req, res) => {
	try {
		await Postgres.query("DELETE FROM albums WHERE album_id = $1", [req.body.albumId]);
		res.status(202).json({
			success: true,
			message: "album deleted",
		});
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while updating album data",
		});
	}
});

module.exports = route;
