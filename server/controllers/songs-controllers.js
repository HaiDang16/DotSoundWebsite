const mongoose = require("mongoose");

const Album = require("../models/album");
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
  console.log("\n Start getSongDetails");
  const filter = { _id: req.params.getOne };
  console.log("songID: ", filter);
  const cursor = await Song.findOne(filter);

  if (cursor) {
    return res.status(200).send({ success: true, song: cursor });
  } else {
    return res.status(200).send({ success: true, msg: "No Data Found" });
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
    let updatedAlbum;
    if (songAlbumID) {
      // Update the corresponding album's albumItems array
      updatedAlbum = await Album.findByIdAndUpdate(
        songAlbumID,
        {
          $push: {
            albumItems: { albumSongID: savedSong._id },
          },
        },
        { new: true }
      );
    }
    console.log("Saved");
    return res.status(200).send({ song: savedSong, alnum: updatedAlbum });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).send({ success: false, msg: error });
  }
};

const updateSong = async (req, res) => {
  const options = {
    upsert: true,
    new: true,
  };
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
    songID,
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
    songID,
  };
  console.log("dataReq: ", dataReq);

  try {
    const result = await Song.findById(songID);
    result.songName = songName;
    result.songImageURL = songImageURL;
    result.songURL = songURL;
    result.songAlbum.songAlbumID = songAlbumID;
    result.songAlbum.songAlbumName = songAlbumName;
    result.songArtist.songArtistID = songArtistID;
    result.songArtist.songArtistName = songArtistName;
    result.songLanguage = songLanguage;
    result.songCategory.songCategoryID = songCategoryID;
    result.songCategory.songCategoryName = songCategoryName;
    await result.save();
    return res
      .status(200)
      .send({ song: result, message: "Cập nhật bài hát thành công" });
  } catch (error) {
    console.log("Error: ", error);
    return res
      .status(400)
      .send({ success: false, message: "Cập nhật bài hát thất bại" });
  }
};

const deleteSong = async (req, res) => {
  console.log("\n Start ");
  const filter = { _id: req.params.deleteId };

  const result = await Song.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, message: "Xoá bài hát thành công" });
  } else {
    res
      .status(200)
      .send({ success: false, message: "Xoá bài hát không thành công" });
  }
};

const getFavoriteSong = async (req, res) => {
  const query = req.query.songId;
  res.send(query);
};

const getNewReleaseSong = async (req, res) => {
  let songs;
  try {
    //Lấy ra những sản phẩm với size bán chạy nhất
    songs = await Song.find().sort({ createAt: 1 }).limit(6);
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
exports.getAllSongs = getAllSongs;
exports.getSongDetails = getSongDetails;
exports.createSong = createSong;
exports.updateSong = updateSong;
exports.deleteSong = deleteSong;
exports.getFavoriteSong = getFavoriteSong;
exports.getNewReleaseSong = getNewReleaseSong;
