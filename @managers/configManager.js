const configManager = () => {
	if (process.env.NODE_ENV === "development.local") {
		return "./.env.development.local";
	} else {
		return "./.env.development";
	}
};

module.exports = configManager;
