const express = require("express");
const route = express.Router();
const { allData, instagram } = require("../controllers/apiControllers");

//GET ALL DATA FOR FIRST LOAD PAGE
route.get("/", allData);

//INSTAGRAM API
route.get("/instagram", instagram);

module.exports = route
