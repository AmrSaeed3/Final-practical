const multer = require("multer");
const fs = require("fs");
const path = require("path");


let fileNames = [];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fileNames.push(file.originalname.split(".")[0]);
    const finalPath = path.join(__dirname, ".." ,"uploads", fileNames[0]);
    fs.mkdirSync(finalPath, { recursive: true });
    cb(null, finalPath);
  },
  filename(req, file, cb) {
    const imageType = file.mimetype.split("/")[0];
    if (imageType === "application") {
      cb(null, file.originalname);
    } else if (imageType === "image") {
      const ext = file.originalname.split(".")[1];
      const fileName = `${fileNames[0]}.${ext}`;
      cb(null, fileName);
    }
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
