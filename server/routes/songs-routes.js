const express = require("express");
const songsControllers = require("../controllers/songs-controllers");

const router = express.Router();

router.get("/GetAllSongs", songsControllers.getAllSongs);

router.get("/GetSongDetails/:getOne", songsControllers.getSongDetails);

router.get("/GetNewReleaseSong", songsControllers.getNewReleaseSong);

router.put("/UpdateSong", songsControllers.updateSong);

router.delete("/DeleteSong/:deleteId", songsControllers.deleteSong);

router.post("/CreateSong", songsControllers.createSong);

module.exports = router;
