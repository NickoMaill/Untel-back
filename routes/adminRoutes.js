const express = require("express");
const route = express.Router();
const { login, ContactEmail } = require("../controllers/adminControllers");
const sendEmail = require("../middlewares/sendEmail");

// LOGIN BACK - OFFICE 
route.post("/login", login);

// SEND A CONTACT EMAIL
route.post("/send-email", sendEmail, ContactEmail);

module.exports = route;
