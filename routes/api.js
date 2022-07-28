// LIBRARY IMPORT
const express = require("express");

// ROUTER
const route = express.Router();

// CONTROLLER IMPORT
const { allData, instagram } = require("../controllers/apiControllers");

//GET ALL DATA FOR FIRST LOAD PAGE
route.get("/", allData);

//INSTAGRAM API
route.get("/instagram", instagram);

module.exports = route
