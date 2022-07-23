// LIBRARY IMPORTS
const express = require("express");
const route = express.Router();
const multer = require("multer");
const upload = multer({ dest: "public/uploads/albumCovers" });

// CONTROLLER IMPORTS
const { allAlbums, albumById, addAlbum, updateAlbum, deleteAlbum } = require("../controllers/albumControllers");
const validBody = require("../middlewares/checkBodyInjection");

route.get("/all", allAlbums);
route.get("/:id", albumById);
route.post("/add-album", validBody, upload.single("image"), addAlbum);
route.put("/update-album/:id", validBody, upload.single("image"), updateAlbum);
route.delete("/delete/:id", deleteAlbum);

module.exports = route;
