const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const admin = require("../config/firebase.config");
const Artist = require("../models/artist");

const getAllArtist = async (req, res) => {
  let artists;

  try {
    artists = await Artist.find().sort({ createAt: 1 });
  } catch (err) {
    return res.status(500).json({
      message: "Lấy dữ liệu nghệ sĩ thất bại. Vui lòng thử lại sau",
      success: false,
    });
  }
  console.log("artists: ", artists);
  if (artists) {
    res.status(200).json({
      artists: artists.map((art) => {
        const obj = art.toObject({ getters: true });
        return obj;
      }),
      success: true,
    });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
};

const getArtistDetails = async (req, res) => {
  const filter = { _id: req.params.getOne };
  const cursor = await Artist.findOne(filter);
  if (cursor) {
    return res.status(200).send({ success: true, artist: cursor });
  } else {
    return res
      .status(200)
      .send({ success: true, message: "Đã xảy ra lỗi. Vui lòng thử lại" });
  }
};

const createArtist = async (req, res) => {
  const newArtist = Artist({
    artistName: req.body.name,
    artistImageURL: req.body.imageURL,
    artistTwitter: req.body.twitter,
    artistInstagram: req.body.instagram,
  });
  try {
    const savedArtist = await newArtist.save();
    res.status(200).send({ artist: savedArtist });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
};

const updateArtist = async (req, res) => {
  let artist;
  const { name, imageURL, twitter, instagram, artistID } = req.body;
  const dataReq = { name, imageURL, twitter, instagram, artistID };
  console.log("dataReq: ", dataReq);
  try {
    artist = await Artist.findById(artistID);
    artist.artistName = name;
    artist.artistImageURL = imageURL;
    artist.artistTwitter = twitter;
    artist.artistInstagram = instagram;
    await artist.save();

    return res
      .status(200)
      .send({ artist: artist, message: "Cập nhật nghệ sĩ thành công" });
  } catch (error) {
    console.log("Error: ", error);
    return res
      .status(400)
      .send({ success: false, message: "Cập nhật nghệ sĩ thất bai" });
  }
};

const deleteArtist = async (req, res) => {
  const filter = { _id: req.params.deleteId };

  const result = await Artist.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
};

exports.deleteArtist = deleteArtist;
exports.updateArtist = updateArtist;
exports.createArtist = createArtist;
exports.getArtistDetails = getArtistDetails;
exports.getAllArtist = getAllArtist;
