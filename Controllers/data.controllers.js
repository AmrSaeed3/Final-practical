const { data1 } = require("../Models/data.models");
const classificationBook = require("../utils/classification of books");
const mammoth = require("mammoth");
// const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");
const moment = require("moment-timezone");
const folderphoto = "uploads";

const addBookWord = async (req, res, next) => {
  const Sound = req.files["Audio"][0].originalname;
  const extensionSound = Sound.split(".")[1];
  const Photo = req.files["Photo"][0].originalname;
  const extensionPhoto = Photo.split(".")[1];
  const filePath = req.files["Word"][0].originalname;
  const name = filePath.split(".")[0];
  // const currentPhoto = `${req.protocol}://${req.get(
  //   "host"
  // )}/${folderphoto}/${name}/${Photo}`;
  const extension = filePath.split(".")[1];
  const newNamePhoto = `${name}.${extensionPhoto}`;
  const newNameSound = `${name}.${extensionSound}`;
  pathData = path.resolve(__dirname, "..", `${folderphoto}/${name}`, filePath);
  const { author, classification } = req.body;
  const oldData = await data1.findOne({ name: name });
  if (oldData) {
    const error = appError.create("data already saved", 400, httpStatus.FAIL);
    return next(error);
  }
  if (!filePath) {
    const error = appError.create(
      "The file was not uploaded",
      400,
      httpStatus.ERROR
    );
    return next(error);
  }

  const absolutePath = pathData;

  fs.readFile(absolutePath, "utf-8", (err, data) => {
    if (err) {
      const error = appError.create(
        "An error occurred while reading the file",
        500,
        httpStatus.ERROR
      );
      return next(error);
    }
    mammoth
      .extractRawText({ path: absolutePath })
      .then(async (result) => {
        const text = result.value;
        const linesPerPage = 50; // عدد السطور في كل صفحة
        const pages = [];
        let linesCount = 0;
        let currentPage = "";

        // تقسيم النص إلى صفحات وترقيم كل جزء
        const lines = text.split("\n");
        lines.forEach((line, index) => {
          if (linesCount < linesPerPage) {
            currentPage += line + "\n";
            linesCount++;
          } else {
            pages.push({
              page: pages.length + 1,
              content: currentPage.trim(),
            });
            currentPage = line + "\n";
            linesCount = 1;
          }
        });
        // إضافة الصفحة الأخيرة إذا كانت غير مكتملة
        if (currentPage !== "") {
          pages.push({
            page: pages.length + 1,
            content: currentPage.trim(),
          });
        }
        const currentDate = moment().tz("Africa/Cairo");
        const newData = new data1({
          name: name,
          extension: extension,
          author: author,
          photo: newNamePhoto,
          sound: newNameSound,
          linesPerPage: linesPerPage,
          totalLines: pages.length * linesPerPage,
          totalPages: pages.length,
          paragraphs: pages,
          date: currentDate.format("DD-MMM-YYYY hh:mm:ss a"),
          Listen: true,
          Read: true,
          classification: classificationBook.History,
        });
        await newData.save();
        return res.status(200).json({
          message: "SUCCESS Upload file",
          name: name,
          extension: extension,
          photo: newNamePhoto,
          author: author,
          sound: newNameSound,
          classification: classification.History,
          linesPerPage: linesPerPage,
          Totallines: pages.length * linesPerPage,
          TotalPages: pages.length,
          Listen: true,
          Read: true,
          data: pages,
        });
      })

      .catch((err) => {
        console.error(err);
      });
  });
};

const allBook = async (req, res, next) => {
  const name = req.params.name;
  const currentPhoto = `${req.protocol}://${req.get(
    "host"
  )}/${folderphoto}/حكاية مصرية`;
  const book = await data1.findOne(
    { name: name },
    { __v: false , extension: false }
  );
  if (!book) {
    const error = appError.create(
      "this chapter not found try again !",
      401,
      statusText.FAIL
    );
    return next(error);
  }
  res.status(200).json({
    id: book._id,
    name : book.name,
    Photo: `${currentPhoto}/${book.photo}`,
    author : book.author,
    totoslPages : book.totalPages,
    audio : `${currentPhoto}/حكاية مصرية.mp3`,
    DatePublish : book.date,
    Listen : book.Listen,
    Read : book.Read,
    data : book.paragraphs,
  });
};

module.exports = {
  addBookWord,
  allBook,
};

