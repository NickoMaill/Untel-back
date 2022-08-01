// MANAGERS
const configManager = require("./@managers/configManager.js");
const env = configManager.configEnv;

// IMPORT
const express = require("express");
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
const { BgGreen, FgYellow, Reload, FgRed, FgMagenta, FgBlack } = require("./utils/logColors");
const sanitizeXss = require("./middlewares/xss.js");

// WATCHDOGS IMPORT
const instagramWatchdog = require("./@watchdog/instagramWatchdog")

// CONST
const app = express();
const PORT = env.PORT || 8000 || 8001;

// CRON INITIALIZATION
instagramWatchdog.initCron();

// FUNCTION USED FOR EACH REQUEST
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/instagram", apiLimiter.instaLimiter);
app.use("*", apiLimiter.serverLimiter);
app.use(morgan("dev"));
app.use(cors({
	origin: env.APP_FRONT_BASE_URL,
}));
app.use(sanitizeXss)
// ROUTES INIT
app.use("/api", apiRoute);
app.use("/gig_dates", gigDatesRoutes);
app.use("/admin", adminRoute);
app.use("/albums", albumRoutes);
app.use("/orders", ordersRoutes);

app.get("/", (req, res) => {
	res.send("<h1>Welcome on Untel Website Backend</h1><br><span>please visite our website at <a href='https://untel-officiel.fr/'>https://untel-officiel.fr/</a></span>");
});

// GUARD IF ERROR ON URL
app.get("*", (_req, res) => {
	console.error(res.app.stack);
	res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});

// SERVER INITIALIZATION
app.listen(PORT, () => {
	console.log("\n", BgGreen, FgBlack, "[Untel's Backend configuration loaded] ⚠️ local only ⚠️", Reload, "\n");

	for (let variable in env) {
			console.log(FgRed, `${variable.padEnd(30, " ")}`, Reload, `= ${env[variable]}`);
	}

	console.log("\n______________________________________________________________\n");
	console.warn("");

	listEndPoints(app).map((info) => {
		const nameRoute = info.middlewares[1] || info.middlewares[0];
		const arrow = "⇨";
		console.info(
			`${nameRoute.padEnd(30, " ")}`,
			FgYellow,
			`${info.methods[0].padEnd(10)}`,
			Reload,
			`${arrow.padEnd(10, " ")} "${info.path}"`
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

	console.log(`listening on http://localhost:${PORT} ✅`);
});
