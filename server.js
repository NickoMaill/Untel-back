//IMPORT
const express = require("express");
const app = express();
require("dotenv").config({
	path: "./config.env",
});
const handlebars = require("express-handlebars");
const path = require("path");
const listEndPoints = require("express-list-endpoints")

//ROUTE IMPORT
const gigDatesRoutes = require("./routes/gigRoute");
const adminRoute = require("./routes/adminRoutes");
const albumRoutes = require("./routes/albumRoutes");
const ordersRoutes = require("./routes/orderRoutes");

//CONTROLLER IMPORTS

//MIDDLEWARES
const cors = require("cors");
const duration = require("./middlewares/cachingRoutes");
const apiLimiter = require("./middlewares/instaLimiter");
const { instagram, allData } = require("./controllers/apis");
const { BgGreen } = require("./utils/logColors");

//PORT CONST
const PORT = process.env.PORT || 8000;

//FUNCTION USED FOR EACH REQUEST
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
// app.use(duration);
app.use("/instagram", apiLimiter);

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

//ROUTES INIT
app.use("/gig_dates", gigDatesRoutes);
app.use("/admin", adminRoute);
app.use("/albums", albumRoutes);
app.use("/orders", ordersRoutes);

// ALBUMS & ALL GIGS IN ON REQUEST
app.get("/", allData);

// GET INSTAGRAM POST
app.get("/instagram", instagram);

// GUARD IF ERROR ON URL
app.get("*", (_req, res) => {
	res.status(404).json({
		success: false,
		message: "Error 404, this page does not exists",
	});
});

listEndPoints(app).map((info) => {
	console.log(`${info.middlewares} - ${info.methods}  ${info.path}`);
})
// PORT LISTENING
console.warn("");
console.warn("||========================================||");
console.warn("   Untel Official Website BackEnd startup");
console.warn("||========================================||");
console.warn("");

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
