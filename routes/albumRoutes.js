const express = require("express");
const route = express.Router();
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/albumCovers" });
const fs = require("fs");
const path = require("path");
const currentDate = require("../utils/getCurrentDate");
const formatDate = require("../utils/formatDate");
const logColors = require("../utils/logColors")

route.get("/all", async (_req, res) => {
	const albums = await Postgres.query("SELECT * FROM albums ORDER BY release_date DESC");
	try {
		albums;
		res.status(200).json({
			success: true,
			albums: albums.rows,
		});
		console.log(logColors.FgGreen,`All albums successfully fetched`);
	} catch (err) {
		console.error(err);
		res.json({
			success: false,
			message: "an error happened when fetching datas",
		});
	}
});

route.get("/:id", async (req, res) => {
	const album = await Postgres.query("SELECT * FROM albums WHERE album_id = $1", [req.params.id]);
	try {
		album;
		res.status(200).json({
			success: true,
			album: album.rows,
		});
		console.log(logColors.FgGreen,`Album ${album.rows[0].title} successfully fetched`);
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while charging album",
		});
	}
});

route.post("/add-album", upload.single("image"), async (req, res) => {
	let type = path.extname(req.file.originalname);
	let fileName = `${req.body.title.toLowerCase().replace(/ /g, "-")}-${currentDate("date")}${type}`;

	try {
		await Postgres.query(
			"INSERT INTO albums (album_id, title, subtitle, release_date, description, playlist_link, video_link, photo_path, color, is_released, price, track_list, shop_link, stream_links, added_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
			[
				uuidv4(),
				req.body.title,
				req.body.subtitle,
			 	formatDate(req.body.releaseDate),
				req.body.description,
				req.body.playlistLink,
				req.body.videoLink,
				`uploads/albumCovers/${fileName}`,
				req.body.color,
				req.body.isReleased,
				parseFloat(req.body.price),
				req.body.setList,
				req.body.shopLink,
				req.body.streamLinks,
				new Date()
			]
		);
		fs.renameSync(req.file.path, path.join(req.file.destination, `${fileName}`));
		res.status(201).json({
			success: true,
			message: "album added",
		});
		console.log(logColors.FgGreen,`Album ${req.body.title} successfully added`);
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened when add an album",
		});
	}
});

route.put("/update-album/:id", upload.single("image"), async (req, res) => {
	let type;
	let fileName;
	let imgPath;

	if (!req.file) {
		const photoPath = await Postgres.query("SELECT photo_path FROM albums WHERE album_id = $1", [req.params.id])
		try {
			imgPath = photoPath.rows[0].photo_path
		} catch (err) {
			console.error(err);
			res.status(400).json({
				success: false,
				message: "an error happened while updating album data",
			});
		}
	} else {
		type = path.extname(req.file.originalname);
		fileName = `${req.body.title.toLowerCase().replace(/ /g, "-")}-${currentDate("date")}${type}`;
		imgPath = `uploads/albumCovers/${fileName}`;

	}

	try {
		await Postgres.query(
			"UPDATE albums SET title = $1, subtitle = $2, release_date = $3, description = $4, playlist_link = $5, video_link = $6, photo_path = $7, color = $8, is_released = $9, price = $10, track_list = $11, shop_link = $12, stream_links = $13, updated_at = $14 WHERE album_id = $15",
			[
				req.body.title,
				req.body.subtitle,
				req.body.releaseDate,
				req.body.description,
				req.body.playlistLink,
				req.body.videoLink,
				imgPath,
				req.body.color,
				req.body.isReleased,
				parseFloat(req.body.price),
				req.body.setList,
				req.body.shopLink,
				req.body.streamLinks,
				new Date(),
				req.params.id,
			]
		);
		if (req.file) {
			fs.renameSync(req.file.path, path.join(req.file.destination, `${fileName}`));
		}

		res.status(202).json({
			success: true,
			message: "album updated",
		});
		console.log(logColors.FgGreen,`Album ${req.body.title} successfully updated`);
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while updating album data",
		});
	}
});

route.delete("/delete/:id", async (req, res) => {
	try {
		await Postgres.query("DELETE FROM albums WHERE album_id = $1", [req.params.id]);
		res.status(202).json({
			success: true,
			message: "album deleted",
		});
		console.log(logColors.FgYellow, `Album ${req.params.id}'s successfully deleted`);
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while updating album data",
		});
	}
});

module.exports = route;
