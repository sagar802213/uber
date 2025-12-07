const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.authuser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const isblacklisted = await require("../models/blacklistToken.model").findOne(
    { token }
  );
  if (isblacklisted) {
    return res
      .status(401)
      .json({ message: "Token is blacklisted. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    req.user = user;
    return next();
  } catch (err) {
    return res.status(400).json({ message: "Unauthorized" });
  }
};
