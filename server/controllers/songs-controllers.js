const mongoose = require("mongoose");

const Song = require("../models/music");

const getAllSongs = async (req, res) => {
  let songs;
  try {
    //Lấy ra những sản phẩm với size bán chạy nhất
    songs = await Song.find().sort({ createAt: 1 });
  } catch (err) {
    return res.status(500).json({
      message: "Lấy dữ liệu bài hát thất bại. Vui lòng thử lại sau",
      success: false,
    });
  }
  res.json({
    songs: songs.map((song) => {
      const obj = song.toObject({ getters: true });
      return obj;
    }),
  });
};

const getSongDetails = async (req, res) => {
  const filter = { _id: req.params.getOne };

  const cursor = await song.findOne(filter);

  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
};

const createSong = async (req, res) => {
  const {
    songName,
    songImageURL,
    songURL,
    songAlbumID,
    songAlbumName,
    songArtistID,
    songArtistName,
    songLanguage,
    songCategoryID,
    songCategoryName,
  } = req.body;

  const dataReq = {
    songName,
    songImageURL,
    songURL,
    songAlbumID,
    songAlbumName,
    songArtistID,
    songArtistName,
    songLanguage,
    songCategoryID,
    songCategoryName,
  };
  console.log("dataReq: ", dataReq);

  const newSong = Song({
    songName: songName,
    songImageURL: songImageURL,
    songURL: songURL,
    songAlbum: {
      songAlbumID: songAlbumID,
      songAlbumName: songAlbumName,
    },
    songArtist: {
      songArtistID: songArtistID,
      songArtistName: songArtistName,
    },
    songLanguage: songLanguage,
    songCategory: {
      songCategoryID: songCategoryID,
      songCategoryName: songCategoryName,
    },
  });
  console.log("Saving");
  try {
    const savedSong = await newSong.save();
    res.status(200).send({ song: savedSong });
    console.log("Saved");
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).send({ success: false, msg: error });
  }
};

const updateSong = async (req, res) => {
  const filter = { _id: req.params.updateId };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await song.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        songUrl: req.body.songUrl,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        category: req.body.category,
      },
      options
    );
    res.status(200).send({ artist: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
};

const deleteSong = async (req, res) => {
  const filter = { _id: req.params.deleteId };

  const result = await song.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
};

const getFavoriteSong = async (req, res) => {
  const query = req.query.songId;
  res.send(query);
};

exports.getAllSongs = getAllSongs;
exports.getSongDetails = getSongDetails;
exports.createSong = createSong;
exports.updateSong = updateSong;
exports.deleteSong = deleteSong;
exports.getFavoriteSong = getFavoriteSong;
