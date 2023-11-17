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
      default: null,
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
      require: true,
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
      default: null,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("music", songSchema);
