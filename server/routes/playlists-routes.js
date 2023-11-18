const express = require("express");
const playlistsControllers = require("../controllers/playlists-controllers");

const router = express.Router();

// // getAll
// router.get("/GetAllAlbums", albumsControllers.getAllAlbums);

// ///getOne/:getOne
// router.get("/GetAllDetails/:getOne", albumsControllers.getAllDetails);

router.get(
  "/GetPlaylistByUserID/:userID",
  playlistsControllers.getPlaylistByUserID
);

router.get(
  "/GetPlaylistDetails/:playlistID",
  playlistsControllers.getPlaylistDetails
);
///save
router.post("/CreatePlaylist", playlistsControllers.createPlaylist);

// ///update/:updateId
// router.put("/UpdateAlbum/:updateId", albumsControllers.updateAlbum);

// ///delete/:deleteId
// router.delete("/DeleteAlbum/:deleteId", albumsControllers.deleteAlbum);
module.exports = router;
