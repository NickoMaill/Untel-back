const { default: xss } = require("xss");

const sanitizeXss = (req, res, next) => {
    if (typeof req.body === "object") {
        sanitizeObject(req.body);
    } else if (typeof req.body === "string") {
        req.body = xss(req.body);
    }
    next();
}

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

module.exports = sanitizeXss