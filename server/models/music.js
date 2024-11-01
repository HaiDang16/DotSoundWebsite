const mongoose = require("mongoose");

const songSchema = mongoose.Schema(
  {
    songName: {
      type: String,
      required: true,
    },
    songImageURL: {
      type: String,
      required: true,
    },
    songURL: {
      type: String,
      required: true,
    },
    songAlbum: {
      songAlbumID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "album",
        required: false,
      },
      songAlbumName: {
        type: String,
        required: false,
      },
    },
    songArtist: {
      songArtistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "artist",
        required: false,
      },
      songArtistName: {
        type: String,
        required: false,
      },
    },
    songLanguage: {
      type: String,
      required: true,
    },
    songCategory: {
      songCategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: false,
      },
      songCategoryName: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("music", songSchema);
