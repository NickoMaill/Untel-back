// LIBRARY IMPORT
const express = require("express");
const route = express.Router();

// CONTROLLER IMPORT
const { allGigs, addGig, updateGig, deleteGig } = require("../controllers/gigRoutesControllers");

route.get("/", allGigs);
route.post("/add", addGig);
route.put("/update-gig/:id", updateGig);
route.delete("/delete/:id", deleteGig);

module.exports = route;
