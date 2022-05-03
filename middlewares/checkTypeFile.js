const path = require("path");

function checkTypeFile(req, res, next) {
	let type = path.extname(req.file.originalname);

	if (type !== ".jpg" && type !== ".jpeg" && type !== ".png" && type !== ".webp") {
		res.status(400).json({
			success: false,
			message: "wrong image format please retry or convert your file",
		});
	}

	if (req.file.size > 5000000) {
		res.status(400).json({
			success: false,
			message: "size too heavy",
		});
	}

	next();
}

module.exports = checkTypeFile;
