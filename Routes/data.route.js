const express = require("express");
const router = express.Router();
const dataController = require("../Controllers/data.controllers");
const multerUpload = require("../Middlewires/multer");

router.post(
  "/addChapterword",
  multerUpload.fields([
    { name: "Word", maxCount: 1 },
    { name: "Photo", maxCount: 1 },
  ]),
  dataController.addChapterword
);

module.exports = router;
