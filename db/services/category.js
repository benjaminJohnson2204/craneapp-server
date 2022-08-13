const { Question } = require("../models/question");

const getAllCategories = async () => {
  try {
    let categories = await Question.distinct("category");
    return categories;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

module.exports = {
  getAllCategories,
};
