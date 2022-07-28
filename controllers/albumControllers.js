// LIBRARY IMPORTS
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// MANAGERS IMPORT
const logManagers = require("../@managers/logManager");

// UTILS IMPORTS
const currentDate = require("../utils/getCurrentDate");
const formatDate = require("../utils/formatDate");
const logColors = require("../utils/logColors");

// GET ALL ALBUMS DATA
const allAlbums = async (_req, res) => {
	const albums = await Postgres.query("SELECT * FROM albums ORDER BY release_date DESC");
	try {
		albums;
		res.status(200).json({
			success: true,
			albums: albums.rows,
		});
		logManagers.info("allAlbums", "All albums correctly fetched");
	} catch (err) {
		console.error(err);
		res.json({
			success: false,
			message: "an error happened when fetching datas",
		});
		logManagers.error("allAlbums", `an error happened when fetching datas - error details -> ${err.detail}`);
	}
};

// GET ALBUM BY ID
const albumById = async (req, res) => {
	const album = await Postgres.query("SELECT * FROM albums WHERE album_id = $1", [req.params.id]);
	try {
		album;
		res.status(200).json({
			success: true,
			album: album.rows,
		});
		logManagers.info("albumById", "Album correctly fetched");
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while charging album",
		});
		logManagers.error("albumById", `an error happened when fetching datas - error details -> ${err.detail}`);
	}
};

// ADD AN ALBUM TO THE DB
const addAlbum = async (req, res) => {
	if (req.script) {
		return res.status(403).json({
			success: false,
			message: "an error happened",
		});
	}

	let type = path.extname(req.file.originalname);
	let fileName = `${req.body.title.toLowerCase().replace(/ /g, "-")}-${currentDate("date")}${type}`;
	const id = uuidv4();

	try {
		await Postgres.query(
			"INSERT INTO albums (album_id, title, subtitle, release_date, description, playlist_link, video_link, photo_path, color, is_released, price, track_list, shop_link, stream_links, added_at, is_selling) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)",
			[
				id,
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
				new Date(),
				req.body.isSelling,
			]
		);
		fs.renameSync(req.file.path, path.join(req.file.destination, `${fileName}`));
		res.status(201).json({
			success: true,
			message: "album added",
		});
		console.log(logColors.FgGreen, `Album ${req.body.title} successfully added`);
		logManagers.verbose(`addAlbum - ${id}`, "album correctly updated");
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened when add an album",
		});
		logManagers.error(`addAlbum - ${id}`, `an error happened while updating album data - error details -> ${err.detail}`);
	}
};

// UPDATE AN ALBUM ON THE DB
const updateAlbum = async (req, res) => {
	if (req.script) {
		return res.status(403).json({
			success: false,
			message: "an error happened",
		});
	}

	let type;
	let fileName;
	let imgPath;

	if (!req.file) {
		try {
			const photoPath = await Postgres.query("SELECT photo_path FROM albums WHERE album_id = $1", [
				req.params.id,
			]);
			imgPath = photoPath.rows[0].photo_path;
			logManagers.verbose("updateAlbumPicture", `success photo album updating`)
		} catch (err) {
			console.error(err);
			res.status(400).json({
				success: false,
				message: "an error happened while updating album data",
			});
			logManagers.error("updateAlbumPicture", `an error happened while updating photo_path - error details -> ${err.detail}`)
			return;
		}
	} else {
		type = path.extname(req.file.originalname);
		fileName = `${req.body.title.toLowerCase().replace(/ /g, "-")}-${currentDate("date")}${type}`;
		imgPath = `uploads/albumCovers/${fileName}`;
	}

	try {
		await Postgres.query(
			"UPDATE albums SET title = $1, subtitle = $2, release_date = $3, description = $4, playlist_link = $5, video_link = $6, photo_path = $7, color = $8, is_released = $9, price = $10, track_list = $11, shop_link = $12, stream_links = $13, updated_at = $14, is_selling = $15 WHERE album_id = $16",
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
				req.body.isSelling,
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
		console.log(logColors.FgGreen, `Album ${req.body.title} successfully updated`);
		logManagers.verbose(`updateAlbum - ${req.params.id}`, "album correctly updated");
		return;
	} catch (err) {
		console.error(err);
		res.status(400).json({
			success: false,
			message: "an error happened while updating album data",
		});
		logManagers.error(`updateAlbum - ${req.params.id}`, `an error happened while updating album data - error details -> ${err.detail}`);
	}
};

// DELETE ALBUM ON THE DB
const deleteAlbum = async (req, res) => {
	try {
		await Postgres.query("DELETE FROM albums WHERE album_id = $1", [req.params.id]);
		res.status(202).json({
			success: true,
			message: "album deleted",
		});
		console.log(logColors.FgYellow, `Album ${req.params.id}'s successfully deleted`);
		logManagers.verbose(`deleteAlbum - ${req.params.id}`, "album correctly updated");
	} catch (err) {
		console.error(err);
		logManagers.error(`deleteAlbum - ${req.params.id}`, `an error happened while updating album data - error details -> ${err.detail}`);
		res.status(400).json({
			success: false,
			message: "an error happened while updating album data",
		});
	}
};

module.exports = { allAlbums, albumById, addAlbum, updateAlbum, deleteAlbum };
