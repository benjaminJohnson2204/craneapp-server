const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const questionSchema = new mongoose.Schema({
    questionText : String,
    category : {type : ObjectId, ref : "Category" },
    options : [{ type : ObjectId, ref : "Option"} ]
});

const Question = mongoose.model("Question", questionSchema);

module.exports = {
    Question
};