const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const admin = require("../config/firebase.config");
const Artist = require("../models/artist");
const Album = require("../models/album");
const Playlist = require("../models/playlist");

const getAllAlbums = async (req, res) => {
  let albums;

  try {
    albums = await Album.find().sort({ createAt: 1 });
  } catch (err) {
    return res.status(500).json({
      message: "Lấy dữ liệu albums thất bại. Vui lòng thử lại sau",
      success: false,
    });
  }
  if (albums) {
    res.status(200).json({
      albums: albums.map((album) => {
        const obj = album.toObject({ getters: true });
        return obj;
      }),
      success: true,
    });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
};

const getAllDetails = async (req, res) => {
  const filter = { _id: req.params.getOne };

  const cursor = await Album.findOne(filter);
  console.log(cursor);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
};

const createPlaylist = async (req, res) => {
  console.log("\n Start createAlbum");
  const { name, imageURL, userID, lstSong } = req.body;
  const dataReq = { name, imageURL, userID, lstSong };
  console.log("dataReq: ", dataReq);

  const newPlaylist = new Playlist({
    playlistUserID: userID,
    playlistName: name,
    playlistImageURL: imageURL,
    playlistItems: lstSong.map((item) => ({ playlistSongID: item.songID })),
  });
  try {
    // Save the playlist to the database
    const savedPlaylist = await newPlaylist.save();
    // Respond with the saved playlist
    return res.status(200).send({
      success: true,
      playlist: savedPlaylist,
      message: "Tạo danh sách phát thành công",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "Lỗi tạo danh sách phát" });
  }
};

const updateAlbum = async (req, res) => {
  const filter = { _id: req.params.updateId };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await Album.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
      },
      options
    );
    res.status(200).send({ album: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
};

const deleteAlbum = async (req, res) => {
  const filter = { _id: req.params.deleteId };

  const result = await Album.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
};

const getPlaylistByUserID = async (req, res) => {
  const userID = { _id: req.params.userID };

  let playlists;

  try {
    playlists = await Playlist.find({ playlistUserID: userID });
  } catch (err) {
    return res.status(500).json({
      message: "Lấy dữ liệu playlist thất bại. Vui lòng thử lại sau",
      success: false,
    });
  }
  if (playlists) {
    res.status(200).json({
      playlists: playlists.map((album) => {
        const obj = album.toObject({ getters: true });
        return obj;
      }),
      success: true,
    });
  } else {
    res.status(200).send({ success: true, msg: "Lỗi dữ liệu" });
  }
};

const getPlaylistDetails = async (req, res) => {
  const playlistID = { _id: req.params.playlistID };
  const playlist = await Playlist.findById(playlistID).populate({
    path: "playlistItems.playlistSongID",
    model: "music",
  });

  if (playlist) {
    res.status(200).send({ success: true, playlist: playlist });
  } else {
    res.status(200).send({ success: true, message: "Không tìm thấy dữ liệu" });
  }
};

exports.createPlaylist = createPlaylist;
exports.getPlaylistByUserID = getPlaylistByUserID;
exports.getPlaylistDetails = getPlaylistDetails;
