const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const captainModel = require("../models/captain.model");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.authuser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const isblacklisted = await blacklistTokenModel.findOne({ token });
  if (isblacklisted) {
    return res
      .status(401)
      .json({ message: "Token is blacklisted. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(400).json({ message: "Unauthorized" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const isblacklisted = await blacklistTokenModel.findOne({ token });

  if (isblacklisted) {
    return res
      .status(401)
      .json({ message: "Token is blacklisted. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);
    if (!captain) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Captain not found" });
    }

    req.captain = captain;
    return next();
  } catch (err) {
    return res.status(400).json({ message: "Unauthorized" });
  }
};
