const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const admin = require("../config/firebase.config");
const Artist = require("../models/artist");
const Album = require("../models/album");

const getAllAlbums = async (req, res) => {
  const options = {
    sort: { createdAt: 1 },
  };

  const albums = await Album.find(options);
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

const createAlbum = async (req, res) => {
  const { name, imageURL, artistID, artistName } = req.body;
  const dataReq = { name, imageURL, artistID, artistName };
  console.log("dataReq: ", dataReq);
  let artData;
  try {
    artData = await Artist.findById(artistID);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: err });
  }
  if (!artData) {
    return res
      .status(404)
      .send({ success: false, message: "Không tìm thấy thông tin nghệ sĩ" });
  }

  const newAlbum = Album({
    albumName: name,
    albumImageURL: imageURL,
    albumArtist: { albumArtistID: artistID, albumArtistName: artistName },
  });

  try {
    const savedAlbum = await newAlbum.save();

    return res.status(200).send({ album: savedAlbum });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error });
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

exports.getAllAlbums = getAllAlbums;
exports.getAllDetails = getAllDetails;
exports.createAlbum = createAlbum;
exports.updateAlbum = updateAlbum;
exports.deleteAlbum = deleteAlbum;
