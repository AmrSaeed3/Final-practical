const mongoose = require("mongoose");
const validator = require("validator");
const userRole = require("../utils/userRoles");
// محتاجه صيانه
const User = new mongoose.Schema({
  userName: {
    type: String,
    require: [true, "user name are required"],
  },
  email: {
    type: String,
    require: [true, "email are required"],
    unique: true,
    validate: [validator.isEmail, "filed must be a valid email address"],
  },
  password: {
    type: String,
    require: [true, "email are required"],
  },
  avatar: {
    type: String,
    default: "profile.png",
  },
  numPhone: {
    type: String,
    require: [true, "email are required"],
  },
  token: {
    type: String,
    require: [true, "token are required"],
  },
  date: {
    type: String,
    require: [true, "date are required"],
  },
  visitors: Number,
  Publish: Number,
  followers: Number,
  role: {
    type: String, //["USER" , "ADMIN" , "MANGER"]
    enum: [userRole.USER, userRole.ADMIN, userRole.MANGER],
    default: userRole.USER,
  },
});

const user1 = mongoose.model("Acount", User);
module.exports = {
  user1,
};
