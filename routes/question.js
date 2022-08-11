const router = require("express").Router();
const passport = require("passport");
const { findOptionById } = require("../db/services/option");
const {
  getQuestionsUnderCategory,
  findQuestionById,
} = require("../db/services/question");

router.get("/category/:categoryId", async (req, res) => {
  let questions = await getQuestionsUnderCategory(req.params.categoryId);
  res.json({
    questions: questions /*, answeredQuestions : req.user.answeredQuestions*/,
  });
});

router.get("/questionId", async (req, res) => {
  const question = await findQuestionById(req.params.questionId);
  const options = question.options.map(optionId => await findOptionById(optionId))
  res.json({ question: {...question, options : options} });
});

module.exports = router;
