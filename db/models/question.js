const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const optionSchema = new mongoose.Schema({
  text: String,
  explanation: String,
  index: Number,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  questionText: String,
  category: String,
  options: [optionSchema],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = {
  Question,
};
