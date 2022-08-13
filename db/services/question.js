const { Question } = require("../models/question");
const { Category } = require("../models/category");
const { Option } = require("../models/option");
const { findOptionById } = require("./option");

const findQuestionById = async (id) => {
  try {
    let question = await Question.findById(id);
    return question;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

const getQuestionsUnderCategory = async (categoryId) => {
  try {
    let questions = await Question.find({ category: categoryId });
    return questions;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

const addQuestion = async (text, category, options) => {
  try {
    let question = await Question.create({
      questionText: text,
      category: category,
      options: options,
    });
    return question;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

const getCorrectOption = (question) => {
  return question.options.filter((option) => option.isCorrect)[0];
};

module.exports = {
  findQuestionById,
  getQuestionsUnderCategory,
  addQuestion,
  getCorrectOption,
};
