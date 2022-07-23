const { default: xss } = require("xss");

const sanitizeObject = (object) => {
    for (let key in object) {
        if (typeof object[key] === "string") {
            object[key] = xss(object[key]);
        }

        if (typeof object[key] === "object") {
            sanitizeObject(object[key]);
        }
    }
}

const sanitizeXss = (req, _res, next) => {
        if (typeof req.body === "object") {
            sanitizeObject(req.body);
        } else if (typeof req.body === "string") {
            req.body = xss(req.body);
        }
    next();
}


module.exports = sanitizeXss;