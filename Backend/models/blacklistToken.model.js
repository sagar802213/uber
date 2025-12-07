const e = require("express");
const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  blacklistedAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Token expires from blacklist after 24 hours
  },
});
module.exports = mongoose.model("BlacklistToken", blacklistTokenSchema);
