const express = require("express");
const albumsControllers = require("../controllers/albums-controllers");

const router = express.Router();

// getAll
router.get("/GetAllAlbums", albumsControllers.getAllAlbums);

///getOne/:getOne
router.get("/GetAllDetails/:getOne", albumsControllers.getAllDetails);

///save
router.post("/CreateAlbum", albumsControllers.createAlbum);

///update/:updateId
router.put("/UpdateAlbum/:updateId", albumsControllers.updateAlbum);

///delete/:deleteId
router.delete("/DeleteAlbum/:deleteId", albumsControllers.deleteAlbum);
module.exports = router;
