//IMPORT
const express = require("express");
const app = express();
require("dotenv").config({
	path: "./config.env",
});
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const fetch = require("node-fetch");
const handlebars = require("express-handlebars");
const fs = require("fs");
const path = require("path");
const limiter = require("express-rate-limit");

const apiLimiter = limiter({
	windowMs: 120 * 60 * 1000, 
	max: 1,
	standardHeaders: true,
	legacyHeaders:false,
	handler: (_req, res, next,_options) => {
		res.status(429)
		next()
	}
})

//ROUTE IMPORT
const gigDatesRoutes = require("./routes/gigRoute");
const adminRoute = require("./routes/adminRoutes");
const albumRoutes = require("./routes/albumRoutes");
const ordersRoutes = require("./routes/orderRoutes");
const backup = require("./data/post.json");

//MIDDLEWARES
const cors = require("./middlewares/cors");
const duration = require("./middlewares/cachingRoutes");

//PORT CONST
const PORT = process.env.PORT || 8000;

//FUNCTION USED FOR EACH REQUEST
app.use(express.json());
app.use(cors);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use('/instagram', apiLimiter)
app.use(duration)

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

//ROUTES INIT
app.use("/gig_dates", gigDatesRoutes);
app.use("/admin", adminRoute);
app.use("/albums", albumRoutes);
app.use("/orders", ordersRoutes);

// app.get("/test", (req, res) => {
// 	res.render("confirmationOrder");
// });

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

app.get("/instagram", apiLimiter, async (_req, res) => {
	const data = await fetch(
		`https://instagram28.p.rapidapi.com/medias?user_id=15269823200&batch_size=50&rapidapi-key=${process.env.INSTAKEY}`
	);
	const response = await data.json();

	if (res.statusCode === 429 || data.status === 429) {
		console.log("JSON file rendered");
		res.status(200).json(backup[0].data.user.edge_owner_to_timeline_media);
	} else {
		const array = [];
		array.push(response);
		fs.writeFile("./data/post.json", JSON.stringify(array), "utf-8", (err) => {
			if (err) throw err;
			console.log("file success update");
		});
		res.status(200).json(array);
	}
});

app.get("*", (_req, res) => {
	res.status(404).send("Error 404, this page does not exists");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));