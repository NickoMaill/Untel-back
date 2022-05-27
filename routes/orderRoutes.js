// LIBRARY IMPORT
const express = require("express");
const route = express.Router();

//CONTROLLERS IMPORTS
const { allOrders, orderById, addOrder } = require("../controllers/orderRoutesControllers");

route.get("/all", allOrders);
route.get("/:id", orderById);
route.post("/add-order", addOrder);

module.exports = route;
