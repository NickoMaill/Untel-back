const express = require("express");
const route = express.Router();
const { login, contactEmail } = require("../controllers/adminControllers");
const validBody = require("../middlewares/checkBodyInjection");

// LOGIN BACK - OFFICE 
route.post("/login", validBody, login);

// SEND A CONTACT EMAIL
route.post("/send-email", validBody, contactEmail);

module.exports = route;
