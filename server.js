// MANAGERS
const configManager = require("./@managers/configManager.js");

// IMPORT
const express = require("express");
require("dotenv").config({
	path: configManager(),
});
const cors = require("cors");
const path = require("path");
const listEndPoints = require("express-list-endpoints");
const morgan = require("morgan");

// ROUTE IMPORT
const apiRoute = require("./routes/api.js");
const gigDatesRoutes = require("./routes/gigRoute");
const adminRoute = require("./routes/adminRoutes");
const albumRoutes = require("./routes/albumRoutes");
const ordersRoutes = require("./routes/orderRoutes");

// MIDDLEWARES
const apiLimiter = require("./middlewares/apiLimiter");
const { BgGreen, FgYellow, Reload, FgRed, FgMagenta } = require("./utils/logColors");
const sanitizeXss = require("./middlewares/xss.js");
const { logger } = require("./@managers/logManager.js");
const { lookup } = require("geoip-lite");

// CONST
const app = express();
const PORT = process.env.PORT || 8000 || 8001;

// FUNCTION USED FOR EACH REQUEST
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use("/instagram", apiLimiter);
app.use(morgan("dev"));
app.use(cors({
	origin: process.env.APP_FRONT_BASE_URL,
}));
app.use(sanitizeXss)
// ROUTES INIT
app.use("/api", apiRoute);
app.use("/gig_dates", gigDatesRoutes);
app.use("/admin", adminRoute);
app.use("/albums", albumRoutes);
app.use("/orders", ordersRoutes);

app.get("/", (req, res) => {
	console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
	console.log(lookup(req.ip));
	res.send(
		"<h1>Welcome on Untel Website Backend</h1><br><span>please visite our website at <a href='https://untel-officiel.fr/'>https://untel-officiel.fr/</a></span>"
	);
});

// GUARD IF ERROR ON URL
app.get("*", (_req, res) => {
	console.error(res.app.stack);
	res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});

// SERVER INITIALIZATION
app.listen(PORT, () => {
	console.log("\n", BgGreen, "[Untel's Backend configuration loaded] ⚠️ local only ⚠️", Reload, "\n");

	for (let variable in process.env) {
		if (variable.startsWith("APP_")) {
			console.log(FgRed, `${variable.padEnd(30, " ")}`, Reload, `= ${process.env[variable]}`);
		}
	}

	console.log("\n______________________________________________________________\n");
	console.warn("");

	listEndPoints(app).map((info) => {
		const nameRoute = info.middlewares;
		console.info(
			`[${nameRoute[1] || nameRoute[0]}] \t\t\t`,
			FgYellow,
			`${info.methods}`,
			Reload,
			` \t\t⇨\t\t"${info.path}"`
		);
	});

	console.warn(FgMagenta, `[${new Date().toISOString()}] ||===========================================||`, Reload);
	console.warn(
		FgMagenta,
		`[${new Date().toISOString()}] `,
		Reload,
		BgGreen,
		"Untel Official Website Backend startup...",
		Reload
	);
	console.warn(FgMagenta, `[${new Date().toISOString()}] ||===========================================||`, Reload);
	console.warn("");

	console.log(`listening on port ${PORT} ✅ \n`);
});
