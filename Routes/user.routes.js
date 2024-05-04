const express = require("express");
const router = express.Router();
const usersController = require("../Controllers/user.controllers");
const {
  validationSchema,
  validationSchema2,
  validationSchema4,
} = require("../Middlewires/validationSchema");
const verifyToken = require("../Middlewires/verify.token");

router.route("/register").post(validationSchema(), usersController.register);

router.route("/verify").post(verifyToken, usersController.verify);

router.route("/login").post(validationSchema2(), usersController.login);

router
  .route("/deleteUser")
  .post(validationSchema4(), usersController.deleteUser);


module.exports = router;
