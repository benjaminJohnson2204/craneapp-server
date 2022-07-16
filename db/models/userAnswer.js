const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const userAnswerSchema = new mongoose.Schema({
    question : { type : ObjectId, ref : "Question" },
    selectedOption : { type : ObjectId, ref : "Option" },
    answeredCorrectly : Boolean
});

const UserAnswer = mongoose.model("UserAnswer", userAnswerSchema);

module.exports = {
    UserAnswer
};