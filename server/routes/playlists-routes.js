const express = require("express");
const playlistsControllers = require("../controllers/playlists-controllers");

const router = express.Router();

// // getAll
// router.get("/GetAllAlbums", albumsControllers.getAllAlbums);

// ///getOne/:getOne
// router.get("/GetAllDetails/:getOne", albumsControllers.getAllDetails);

///save
router.post("/CreatePlaylist", playlistsControllers.createPlaylist);

// ///update/:updateId
// router.put("/UpdateAlbum/:updateId", albumsControllers.updateAlbum);

// ///delete/:deleteId
// router.delete("/DeleteAlbum/:deleteId", albumsControllers.deleteAlbum);
module.exports = router;
