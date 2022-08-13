const router = require("express").Router();
const {
  getQuestionsUnderCategory,
  findQuestionById,
} = require("../db/services/question");
const { UserAnswer } = require("../db/models/userAnswer");
const { ensureAuthenticated } = require("./auth");

router.get("/category/:category", async (req, res) => {
  let questions = await getQuestionsUnderCategory(req.params.category);
  res.json({
    questions: questions,
  });
});

router.get("/:questionId", async (req, res) => {
  const question = await findQuestionById(req.params.questionId);
  res.json({ question: question });
});

// Get what fraction of questions under a category the user has correctly answered
router.get(
  "/fractionComplete/:category",
  ensureAuthenticated,
  async (req, res) => {
    let questions = await getQuestionsUnderCategory(req.params.category);
    let correctAnswers = 0;
    const allUserAnswers = await UserAnswer.find({ user: req.user });
    for (const userAnswer of allUserAnswers) {
      if (!userAnswer.answeredCorrectly) {
        continue;
      }
      const question = await findQuestionById(userAnswer.question);
      if (question.category === req.params.category) {
        correctAnswers++;
      }
    }
    res.json({ total: questions.length, correct: correctAnswers });
  }
);

module.exports = router;
