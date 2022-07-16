const { UserAnswer } = require("../models/userAnswer");
const { findQuestionById, getCorrectOption } = require("./question");

const addUserAnswer = async (user, questionId, selectedOptionId) => {
    try {
        let question = await findQuestionById(userAnswer.questionId);
        let answeredCorrectly = (selectedOptionId === getCorrectOption(question));
        let userAnswer = new UserAnswer({
            question : questionId,
            selectedOption : selectedOptionId,
            answeredCorrectly : answeredCorrectly
        });
        await userAnswer.save();
        user.answeredQuestions.push(userAnswer);
        await user.save();
    } catch (error) {
        console.error(error.message);
        return false;
    }
};


module.exports = {
    addUserAnswer
};