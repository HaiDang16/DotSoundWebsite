const express = require("express");
const artistsControllers = require("../controllers/artists-controllers");

const router = express.Router();

// getAll
router.get("/GetAllArtist", artistsControllers.getAllArtist);

///getOne/:getOne
router.get("/GetArtistDetails/:getOne", artistsControllers.getArtistDetails);

///save
router.post("/CreateArtist", artistsControllers.createArtist);

///update/:updateId
router.put("/UpdateArtist", artistsControllers.updateArtist);

///delete/:deleteId
router.delete("/DeleteArtist/:deleteId", artistsControllers.deleteArtist);
module.exports = router;
