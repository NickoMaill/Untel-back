const express = require("express");
const { login, sendContactEmail } = require("../controllers/adminControllers");
const route = express.Router();
const sendEmail = require("../middlewares/sendEmail");

route.post("/login", login);

route.post("/send-email", sendEmail, sendContactEmail);
module.exports = route;
