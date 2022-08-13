const { UserAnswer } = require("../models/userAnswer");
const { findQuestionById, getCorrectOption } = require("./question");

const addUserAnswer = async (user, questionId, selectedOptionIndex) => {
  try {
    let question = await findQuestionById(questionId);
    let correctOption = getCorrectOption(question);
    let answeredCorrectly = selectedOptionIndex === correctOption.index;
    let userAnswer = await UserAnswer.create({
      user: user._id,
      question: questionId,
      selectedOptionIndex: selectedOptionIndex,
      answeredCorrectly: answeredCorrectly,
    });
    user.answeredQuestions.push(userAnswer._id);
    await user.save();
    return userAnswer;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

module.exports = {
  addUserAnswer,
};
