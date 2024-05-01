const express = require("express");
const router = express.Router();
const usersController = require("../Controllers/user.controllers");
const {
  validationSchema,
  validationSchema2,
  validationSchema3,
  validationSchema4,
} = require("../Middlewires/validationSchema");
const verifyToken = require("../Middlewires/verify.token");

router.route("/register").post(validationSchema(), usersController.register);

router.route("/login").post(validationSchema2(), usersController.login);

router
  .route("/deleteUser")
  .post(validationSchema4(), usersController.deleteUser);

router.route("/success").get(usersController.success);

router.route("/failure").get(usersController.failure);

// router.route("/logout").get(usersController.logout);

router.route("/logout2").get(usersController.logout2);

module.exports = router;
