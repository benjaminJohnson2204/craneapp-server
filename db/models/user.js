const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const userSchema = new mongoose.Schema({
    username : String,
    hashedPassword : String,
    answeredQuestions : [{ type : ObjectId, ref : "UserAnswer"}]
})

const User = mongoose.model("User", userSchema);

module.exports = {
    User
};