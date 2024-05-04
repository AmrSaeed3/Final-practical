const mongoose = require("mongoose");
const classification = require("../utils/classification of books");

const Chapters = new mongoose.Schema({
  name: String,
  extension: String,
  photo: String,
  author: String,
  totalLines: Number,
  totalPages: Number,
  paragraphs: Array,
  date : String,
  classification: {
    type: String,
    enum: [
      classification.Arts_Entertainment,
      classification.General_sciences,
      classification.Geography,
      classification.History,
      classification.Language,
      classification.Literature,
      classification.Natural_Sciences,
      classification.Philosophy,
      classification.Religions,
      classification.Social_Sciences,
      classification.Technology,
      classification.politics,
    ],
    default: "التاريخ",
  },
});

const data1 = mongoose.model("Books", Chapters);

module.exports = {
  data1,
};
