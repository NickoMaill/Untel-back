const express = require("express");
const route = express.Router();
const { login, contactEmail } = require("../controllers/adminControllers");
const sendEmail = require("../middlewares/sendEmail");
const { sendContactEmail } = require("../utils/orderEmail");

// LOGIN BACK - OFFICE 
route.post("/login", login);

// SEND A CONTACT EMAIL
route.post("/send-email", contactEmail);

module.exports = route;
