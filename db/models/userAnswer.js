const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userAnswerSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "User" },
  question: { type: ObjectId, ref: "Question" },
  selectedOptionIndex: Number,
  answeredCorrectly: Boolean,
});

const UserAnswer = mongoose.model("UserAnswer", userAnswerSchema);

module.exports = {
  UserAnswer,
};
