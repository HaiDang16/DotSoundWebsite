const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const admin = require("../config/firebase.config");
const Artist = require("../models/artist");

const getAllArtist = async (req, res) => {
  const options = {
    sort: { createdAt: 1 },
  };
  const artists = await Artist.find(options);
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
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
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
  const filter = { _id: req.params.updateId };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await Artist.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
      },
      options
    );
    res.status(200).send({ artist: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
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
