const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.DB_CONNECT, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
}
module.exports = connectDB;

//  start with 13 min
