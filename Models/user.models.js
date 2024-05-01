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
  token: {
    type: String,
    require: [true, "token are required"],
  },
  date: {
    type: String,
    require: [true, "date are required"],
  },
  role: {
    type: String, //["USER" , "ADMIN" , "MANGER"]
    enum: [userRole.USER, userRole.ADMIN, userRole.MANGER],
    default: userRole.USER,
  },
  Info :{
    type: Array,
  },
});
const UserToken = new mongoose.Schema({
  token: String,
});


const user1 = mongoose.model("Acount", User);
const user2 = mongoose.model("UserToken", UserToken);
module.exports = {
  user1,
  user2,
};
