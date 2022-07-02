// MANAGERS
const configManager = require("./@managers/configManager.js");

// IMPORT
const express = require("express");
require("dotenv").config({
	path: configManager(),
});
const handlebars = require("express-handlebars");
const path = require("path");
const listEndPoints = require("express-list-endpoints");
const morgan = require("morgan");

// ROUTE IMPORT
const apiRoute = require("./routes/api.js");
const gigDatesRoutes = require("./routes/gigRoute");
const adminRoute = require("./routes/adminRoutes");
const albumRoutes = require("./routes/albumRoutes");
const ordersRoutes = require("./routes/orderRoutes");

// CONTROLLER IMPORTS

// MIDDLEWARES
const cors = require("cors");
const duration = require("./middlewares/cachingRoutes");
const apiLimiter = require("./middlewares/instaLimiter");
const { BgGreen, FgYellow, Reload, FgRed, FgMagenta } = require("./utils/logColors");
const sanitizeXss = require("./middlewares/xss.js");
const { logger } = require("./@managers/logManager.js");

// CONST
const app = express();
const PORT = process.env.PORT || 8000 || 8001;

// FUNCTION USED FOR EACH REQUEST
app.use(express.json({ limit:"10mb" }));
app.use(cors());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(duration);
app.use("/instagram", apiLimiter);
app.use(morgan('dev'));
app.use(sanitizeXss);

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// ROUTES INIT
app.use("/api", apiRoute);
app.use("/gig_dates", gigDatesRoutes);
app.use("/admin", adminRoute);
app.use("/albums", albumRoutes);
app.use("/orders", ordersRoutes);

app.get("/", (_req, res) => {
	res.send("<h1>Welcome on Untel Website Backend</h1><br><span>please visite our website at <a href='https://untel-officiel.fr/'>https://untel-officiel.fr/</a></span>")
})

console.log(process.env.NODE_ENV);

// GUARD IF ERROR ON URL
app.get("*", (_req, res) => {
	console.log(res.app.stack);
	res.status(404).json({
		success: false,
		message: "Error 404, this page does not exists",
	});
});
// SERVER INITIALIZATION
app.listen(PORT, () => {
	console.log("\n", BgGreen, "[Untel's Backend configuration loaded] ⚠️ local only ⚠️", Reload, "\n");

	for (let variable in process.env) {
		if (variable.startsWith("APP_")) {
			console.log(FgRed, `${variable.padEnd(30, ' ')}`, Reload, `= ${process.env[variable]}`);
		}
	};

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
	console.warn(FgMagenta, `[${new Date().toISOString()}] `, Reload, BgGreen, "Untel Official Website Backend startup...", Reload);
	console.warn(FgMagenta, `[${new Date().toISOString()}] ||===========================================||`, Reload);
	console.warn("");
	
	console.log(`listening on port ${PORT} ✅ \n`);
});

