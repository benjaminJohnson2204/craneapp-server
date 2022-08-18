const router = require("express").Router();
const passport = require("passport");
const { UserAnswer } = require("../db/models/userAnswer");
const { findQuestionById } = require("../db/services/question");
const { addUserAnswer } = require("../db/services/userAnswer");
const { ensureAuthenticated } = require("./auth");

router.post("/answer", ensureAuthenticated, async (req, res) => {
  // Ensure that user hasn't already provided this answer to this question
  let userAnswer = await UserAnswer.findOne({
    user: req.user,
    question: req.body.questionId,
    selectedOptionIndex: req.body.selectedOptionIndex,
  });
  if (userAnswer) {
    return res
      .status(400)
      .json({ error: "Question already answered with that answer" });
  }
  userAnswer = await addUserAnswer(
    req.user,
    req.body.questionId,
    req.body.selectedOptionIndex
  );
  res.json({ correct: userAnswer.answeredCorrectly });
});

// Get all the user's past answers
router.get("/all", ensureAuthenticated, async (req, res) => {
  const userAnswers = await UserAnswer.find({ user: req.user });
  res.json({ userAnswers: userAnswers });
});

// Get answers by category
router.get("/category/:category", ensureAuthenticated, async (req, res) => {
  const allUserAnswers = await UserAnswer.find({ user: req.user });
  const userAnswers = [];
  for (const userAnswer of allUserAnswers) {
    const question = await findQuestionById(userAnswer.question);
    if (question.category === req.params.category) {
      userAnswers.push(userAnswer);
    }
  }
  res.json({ userAnswers: userAnswers });
});

// Get answer to a specific question
router.get("/question/:questionId", ensureAuthenticated, async (req, res) => {
  const userAnswers = await UserAnswer.find({
    user: req.user,
    question: req.params.questionId,
  });
  res.json({ userAnswers: userAnswers });
});

// Reset ALL answered questions
router.post("/reset", ensureAuthenticated, async (req, res) => {
  await UserAnswer.deleteMany({ user: req.user });
  res.json("Successfully reset all answered questions");
});

// Reset all answered questions under a certain category
router.post(
  "/reset/category/:category",
  ensureAuthenticated,
  async (req, res) => {
    const allUserAnswers = await UserAnswer.find({ user: req.user });
    for (const userAnswer of allUserAnswers) {
      const question = await findQuestionById(userAnswer.question);
      if (question.category === req.params.category) {
        console.log(userAnswer);
        await userAnswer.remove();
      }
    }
    res.json("Successfully reset answered questions under category");
  }
);

// Reset answer(s) to a certain question
router.post(
  "/reset/question/:questionId",
  ensureAuthenticated,
  async (req, res) => {
    await UserAnswer.deleteMany({
      user: req.user,
      question: req.params.questionId,
    });
    res.json("Successfully reset answer(s) to question");
  }
);

module.exports = router;
