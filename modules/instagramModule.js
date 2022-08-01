const fetch = require("node-fetch");
const { configEnv } = require("../@managers/configManager");
const logManagers = require("../@managers/logManager");
const { writeJson } = require("../utils/writeJSON");

const getInstagramData = async () => {
	const response = await fetch(`https://instagram28.p.rapidapi.com/medias?user_id=15269823200&batch_size=50&rapidapi-key=${configEnv.APP_API_INSTAKEY}`);
	const data = await response.json();

	if (data.status === 429) {
		logManagers.debug("instagram", `get data from backup JSON - ${response}`);
	} else {
		writeJson("/../data/post.json", data.data.user.edge_owner_to_timeline_media.edges);
		logManagers.debug("instagram", "data correctly fetched");
        console.log();
	}
};

module.exports = { getInstagramData };