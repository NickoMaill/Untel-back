// LIBRARY IMPORT
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const fetch = require("node-fetch");

// MANAGERS IMPORT
const logManagers = require("../@managers/logManager");
const configManager = require("../@managers/configManager.js");
const env = configManager.configEnv;

// UTILS IMPORT
const { writeJson } = require("../utils/writeJSON");
const { formatUrl } = require("../utils/formatUrl");

// DATA IMPORT
const backup = require("../data/post.json");

const allData = async (_req, res) => {
	const gigs = await Postgres.query("SELECT * FROM gig_dates");
	const albums = await Postgres.query(
		"SELECT album_id, title, subtitle, release_date, photo_path, is_released FROM albums"
	);
	try {
		res.status(200).json({
			success: true,
			gigs: gigs.rows,
			gigsCount: gigs.rowCount,
			albums: albums.rows,
			albumsCount: albums.rowCount,
		});
		logManagers.debug("firstDataDB", "first data correctly fetched");
	} catch (err) {
		console.error(err);
		logManagers.error("firstDataDB", `an error happened when fetching datas - error details -> ${err.detail}`);
		res.status(400).json({
			success: false,
			message: "An error happened when fetching datas",
		});
	}
};

const instagram = async (req, res) => {

	const requestOutput = backup.map((post) => {
		return {
			postId: post.node.shortcode,
			pictureUrl: `https://scp2.elfsightcdn.com/?url=https://scontent-lhr8-2.cdninstagram.com/v/${formatUrl(post.node.thumbnail_resources[1].src)}`,
			isVideo: post.node.is_video,
			likeCount: post.node.edge_media_preview_like.count,
			commentCount: post.node.edge_media_to_comment.count,
			postText: post.node.edge_media_to_caption.edges[0].node.text,
		};
	});
	res.status(200).json(requestOutput);
};

module.exports = { instagram, allData };
