const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    cusFirstName: {
      type: String,
      required: true,
    },
    cusLastName: {
      type: String,
      required: true,
    },
    cusEmail: {
      type: String,
      required: true,
    },
    cusAvatar: {
      type: String,
      required: null,
    },
    googleID: {
      type: String,
      required: null,
    },
    emailVerified: {
      type: Boolean,
      reuired: null,
    },
    cusRole: {
      type: String,
      required: true,
    },
    authTime: {
      type: String,
      required: null,
    },
    cusPhoneNum: {
      type: String,
      default: null,
    },
    cusBirthday: {
      type: Date,
      default: null,
    },
    cusSex: {
      type: Number,
      default: null,
    },
    cusPassword: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("account", accountSchema);
