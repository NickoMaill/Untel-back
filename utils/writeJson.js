const logManagers = require('../@managers/logManager');
const fs = require("fs");

const writeJson = (filePath, array) => {
    fs.writeFile(__dirname + filePath, JSON.stringify(array, null, 2), "utf-8", (err) => {
        if (err) console.error(err);
        console.log("file success update");
        logManagers.debug("instagram", "file success update")
    });
}

module.exports = { writeJson }