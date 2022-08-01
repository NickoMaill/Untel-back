const schedule = require("node-schedule");
const instagramModule = require("../modules/instagramModule");

const initCron = () => {
    const interval = "0 */5 * * *";

    schedule.scheduleJob(interval, () => {
        instagramModule.getInstagramData();
    })
}

module.exports = { initCron };