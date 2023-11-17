const mongoose = require("mongoose");

const albumSchema = mongoose.Schema(
  {
    albumName: {
      type: String,
      required: true,
    },
    albumImageURL: {
      type: String,
      required: true,
    },
    albumArtist: {
      albumArtistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "artist",
        required: true,
      },
      albumArtistName: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("album", albumSchema);
