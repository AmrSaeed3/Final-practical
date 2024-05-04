const express = require("express");
const router = express.Router();
const dataController = require("../Controllers/data.controllers");
const multerUpload = require("../Middlewires/multer");

router.route(
  "/addBookWord").post(
  multerUpload.fields([
    { name: "Word", maxCount: 1 },
    { name: "Photo", maxCount: 1 },
    { name: "Audio", maxCount: 1 },
  ]),
  dataController.addBookWord
);

router.route("/readBook/:name").get( dataController.allBook);

module.exports = router;
