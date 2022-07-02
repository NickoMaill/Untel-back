const winston = require("winston");
const path = require("path")
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

const logPath = path.join(path.resolve(__dirname, '../'), "logs");
const logFormat = winston.format.printf(({ level, label, message, timestamp }) => {
        return `[${timestamp}] -- ${level} -- [${label}] : ${message}`;
    }
);

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports:[
        new winston.transports.File({filename: `${logPath}/error.log`, level: 'error'}),
        new winston.transports.File({filename: `${logPath}/combined.log`, level: 'debug'}),
        new winston.transports.File({filename: `${logPath}/warn.log`, level: 'warn'}),
        new winston.transports.File({filename: `${logPath}/info.log`, level: 'info'}),    
        new winston.transports.File({filename: `${logPath}/verbose.log`, level: 'verbose'}),  
        new winston.transports.Console({level: 'warn'}),
    ]
});

module.exports = {
    okStatus, 
    errorStatus, 
    notFoundStatus,
    forbiddenStatus,
    logger,
}