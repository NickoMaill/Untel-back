//IMPORT
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({
	path: "./config.env",
});
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const fetch = require("node-fetch");
const fs = require("fs");

//ROUTE IMPORT
const gigDatesRoutes = require("./routes/gigRoute");
const adminRoute = require("./routes/adminRoutes");
const albumRoutes = require("./routes/albumRoutes");
const backup = require("./data/post.json");

//MIDDLEWARES
const cors = require("./middlewares/cors");

//PORT CONST
const PORT = process.env.PORT || 8000;

//FUNCTION USED FOR EACH REQUEST
app.use(express.json());
app.use(cors);
app.use(express.static("public"));

//ROUTES INIT
app.use("/gig_dates", gigDatesRoutes);
app.use("/admin", adminRoute);
app.use("/albums", albumRoutes);

app.get("/", async (_req, res) => {
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
});

app.get("/instagram", async (req, res) => {
	const data = await fetch(`https://www.instagram.com/untel.officiel/channel/?__a=1`);

	if (data.size === 0) {
		res.json(backup).status(200);
	} else {
		const response = await data.json();
		res.json(response).status(200);
		fs.writeFile("./data/post.json", response, (err) => {
			if (err) throw err
			console.log("fichier mis a jour");
		});
	}
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
