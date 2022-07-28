// LIBRARY IMPORT
const express = require("express");

// ROUTER
const route = express.Router();

// CONTROLLER IMPORT
const { allGigs, addGig, updateGig, deleteGig } = require("../controllers/gigRoutesControllers");
const validBody = require("../middlewares/checkBodyInjection");

route.get("/", allGigs);
route.post("/add", validBody, addGig);
route.put("/update-gig/:id", validBody, updateGig);
route.delete("/delete/:id", deleteGig);

module.exports = route;
