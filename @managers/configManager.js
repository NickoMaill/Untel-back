const configManager = () => {
	if (process.env.NODE_ENV === "development.local") {
		return "./.env.development.local";
	} else {
		return "./.env.development";
	}
};

module.exports.configEnv = {
	NODE_ENV,
	PGHOST,
	PGDATABASE,
	PGUSER,
	PGPORT,
	PGPASSWORD,
	APP_ADMIN_PASS,
	APP_SERVICE_MAIL,
	APP_HOST_MAIL,
	APP_USER_MAIL,
	APP_PASS_MAIL,
	APP_FRONT_BASE_URL,
	APP_API_INSTAKEY,
} = process.env;

module.exports = configManager;
