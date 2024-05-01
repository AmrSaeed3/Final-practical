const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const connectFlash = require("connect-flash");
const httpStatusTex = require("./utils/httpStatus");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
require("dotenv").config();
const utl = process.env.MONGO_URL;
mongoose.connect(utl).then(() => {
  console.log("mongoDB server start");
});
app.use(express.json());
app.use(
  expressSession({
    secret: process.env.JWT_SECLET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
//
const cors = require("cors");
app.use(cors());
const compression = require("compression");
app.use(compression());
app.use(connectFlash());
app.use(bodyParser.json());


const usersRouter = require("./Routes/user.routes");
app.use("/", usersRouter); //api/users

app.use('/uploads',express.static(path.join(__dirname ,'uploads')))
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatusTex.ERROR,
    message: "this resource is not available , write again API",
  });
});
//global error handlar
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusTex.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    // data: null,
  });
});
const port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log(`example app listening on port ${process.env.PORT || port}`);
});
