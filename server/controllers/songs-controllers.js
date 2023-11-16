const mongoose = require("mongoose");

const Song = require("../models/song");

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
exports.getAllSongs = getAllSongs;
