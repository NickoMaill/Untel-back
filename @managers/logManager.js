const { FgGreen, Reload, FgRed, FgYellow } = require("../utils/logColors");
const winston = require("winston");
const path = require("path");

const okStatus = (method, uri, status) => {
	return console.log(`${method} '${uri}'`, FgGreen, status.toString(), Reload, "successfully requested");
};

const errorStatus = (method, uri, status) => {
	return console.error(`${method} '${uri}'`, FgRed, status.toString(), Reload, "is get an error while requested");
};

const notFoundStatus = (method, uri, status) => {
	return console.error(
		`${method} '${uri}'`,
		FgYellow,
		status.toString(),
		Reload,
		`this route does not existe, please request a correct uri...`,
		Reload
	);
};

const forbiddenStatus = (method, uri, status) => {
	return console.error(`${method} '${uri}'`, FgYellow, status.toString(), Reload, `Unauthorize access`, Reload);
};

const logPath = path.join(path.resolve(__dirname, "../"), "logs");
const logFormat = winston.format.printf(({ level, label, message, timestamp }) => {
	return `[${timestamp}] -- ${level} -- [${label}] : ${message}`;
});

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(winston.format.timestamp(), logFormat),
	transports: [
		new winston.transports.File({ filename: `${logPath}/error.log`, level: "error" }),
		new winston.transports.File({ filename: `${logPath}/combined.log`, level: "debug" }),
		new winston.transports.File({ filename: `${logPath}/warn.log`, level: "warn" }),
		new winston.transports.File({ filename: `${logPath}/info.log`, level: "info" }),
		new winston.transports.File({ filename: `${logPath}/verbose.log`, level: "verbose" }),
		new winston.transports.Console({ level: "warn" }),
	],
});

const debug = (key, message) => {
	logger.debug("debug", message, { label: key });
};

const verbose = (key, message) => {
	logger.log("verbose", message, { label: key });
};

const info = (key, message) => {
	logger.log("info", message, { label: key });
};

const warn = (key, message) => {
	logger.warn("warn", message, { label: key });
};

const error = (key, message) => {
	logger.error("error", message, { label: key });
};

module.exports = {
	okStatus,
	errorStatus,
	notFoundStatus,
	forbiddenStatus,
	debug,
	verbose,
	info,
	warn,
	error,
};
