const { FgGreen, Reload, FgRed, FgYellow } = require("../utils/logColors");

const okStatus = (method, uri, status) => {
    return console.log(`${method} '${uri}'`, FgGreen, status.toString(), Reload, "successfully requested");
}

const errorStatus = (method, uri, status) => {
    return console.error(`${method} '${uri}'`, FgRed, status.toString(), Reload, "is get an error while requested");
}

const notFoundStatus = (method, uri, status) => {
    return console.error(`${method} '${uri}'`, FgYellow, status.toString(), Reload, `this route does not existe, please request a correct uri...`, Reload);
}

const forbiddenStatus = (method, uri, status) => {
    return console.error(`${method} '${uri}'`, FgYellow, status.toString(), Reload, `Unauthorize access`, Reload);
}

module.exports = {
    okStatus, 
    errorStatus, 
    notFoundStatus,
    forbiddenStatus,
}