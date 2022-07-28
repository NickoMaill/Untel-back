const dotenv = require("dotenv");

const configEnvFile = () => {
	if (process.env.NODE_ENV === "development.local") {
		return "./.env.development.local";
	} else {
		return "./.env.development";
	}
};

dotenv.config({
	path: configEnvFile(),
})

const configEnv = {
	NODE_ENV: process.env.NODE_ENV,
	PGHOST: process.env.PGHOST,
	PGDATABASE: process.env.PGDATABASE,
	PGUSER: process.env.PGUSER,
	PGPORT: process.env.PGPORT,
	PGPASSWORD: process.env.PGPASSWORD,
	APP_ADMIN_PASS: process.env.APP_ADMIN_PASS,
	APP_SERVICE_MAIL: process.env.APP_SERVICE_MAIL,
	APP_HOST_MAIL: process.env.APP_HOST_MAIL,
	APP_USER_MAIL: process.env.APP_USER_MAIL,
	APP_PASS_MAIL: process.env.APP_PASS_MAIL,
	APP_FRONT_BASE_URL: process.env.APP_FRONT_BASE_URL,
	APP_API_BASE_URL: process.env.APP_API_BASE_URL,
	APP_API_INSTAKEY: process.env.APP_API_INSTAKEY,
	APP_SENDINGBLUE_API_KEY: process.env.APP_SENDINGBLUE_API_KEY,
	PORT: process.env.PORT,
};

module.exports = { configEnvFile, configEnv };
