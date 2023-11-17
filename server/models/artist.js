const mongoose = require("mongoose");
const artistSchema = mongoose.Schema(
  {
    artistName: {
      type: String,
      required: true,
    },
    artistImageURL: {
      type: String,
      required: true,
    },
    artistTwitter: {
      type: String,
      required: false,
    },
    artistInstagram: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("artist", artistSchema);
