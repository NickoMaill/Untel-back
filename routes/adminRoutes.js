// LIBRARY IMPORT
const express = require("express");

// ROUTER 
const route = express.Router();

// CONTROLLER IMPORT
const { login, contactEmail } = require("../controllers/adminControllers");

// MIDDLEWARE IMPORT
const validBody = require("../middlewares/checkBodyInjection");

// LOGIN BACK - OFFICE 
route.post("/login", validBody, login);

// SEND A CONTACT EMAIL
route.post("/send-email", validBody, contactEmail);

module.exports = route;
