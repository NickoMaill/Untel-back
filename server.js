//IMPORT
const express = require("express");
const app = express();
require("dotenv").config({
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
const ordersRoutes = require("./routes/orderRoutes");
const backup = require("./data/post.json");

//MIDDLEWARES
const cors = require("./middlewares/cors");

//PORT CONST
const PORT = process.env.PORT || 8000;

//FUNCTION USED FOR EACH REQUEST
app.use(express.json());
app.use(cors);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//ROUTES INIT
app.use("/gig_dates", gigDatesRoutes);
app.use("/admin", adminRoute);
app.use("/albums", albumRoutes);
app.use("/orders", ordersRoutes);

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
	const data = await fetch(
		`https://www.instagram.com/graphql/query/?query_id=17888483320059182&id=15269823200&first=1000`
	);
	const contentType = data.headers.get("content-type");
	const array = [];

	if (contentType && contentType.indexOf("application/json") !== -1) {
		const response = await data.json();
		array.push(response);
		fs.writeFile("./data/post.json", JSON.stringify(array), "utf-8", (err) => {
			if (err) throw err;
			console.log("fichier mis a jour");
		});
		res.json(array[0].data.user.edge_owner_to_timeline_media).status(200);
	} else {
		res.json(backup[0].data.user.edge_owner_to_timeline_media).status(200);
	}
});

app.get("*", (_req, res) => {
	res.status(404).send("Error 404, this page does not exists");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));