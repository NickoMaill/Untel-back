// LIBRARY IMPORT
const express = require("express");
const route = express.Router();

//CONTROLLERS IMPORTS
const { allOrders, orderById, addOrder, queryOrder, downloadOrder } = require("../controllers/orderRoutesControllers");

route.get("/", allOrders);
route.get("/id/:id", orderById);
route.get("/query", queryOrder);
route.post("/add-order", addOrder);
route.get("/download-order/:id", downloadOrder);

module.exports = route;
