const logManagers = require("../@managers/logManager");

const validBody = (req, res, next) => {
	const body = req.body;
	const scriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/;

	Object.keys(body).map((key) => {
		if (body[key].toString().match(scriptRegex)) {
			console.warn("script injection detected");
			logManagers.warn("validBody", "script injection detected");
            req.script = true;
		}
	});
	next();
};

module.exports = validBody;
