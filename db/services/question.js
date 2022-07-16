const { Question } = require("../models/question");
const { Category } = require("../models/category");
const { Option } = require("../models/option");
const { findOptionById } = require("./option");

const findQuestionById = async (id) => {
    try {
        let question = await Question.findById(id).exec();
        return question;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

const getQuestionsUnderCategory = async (categoryId) => {
    try {
        let questions = await Question.find({category : categoryId}).exec();
        return questions;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

const addQuestion = async (text, category, options) => {
    try {
        let question = new Question({
            questionText : text,
            category : category,
            options : options
        });
        await question.save();
        return question;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

const getCorrectOption = async question => {
    return question.options.map(option => findOptionById(option)).filter(option => option.isCorrect)[0];
};


module.exports = {
    findQuestionById,
    getQuestionsUnderCategory,
    addQuestion,
    getCorrectOption
};