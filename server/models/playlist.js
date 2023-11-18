const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema(
  {
    playlistUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    playlistName: {
      type: String,
      required: true,
    },
    playlistImageURL: {
      type: String,
    },
    playlistItems: [
      {
        playlistSongID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "music",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("playlist", playlistSchema);
