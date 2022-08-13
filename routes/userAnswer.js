const router = require("express").Router();
const passport = require("passport");
const { addUserAnswer } = require("../db/services/userAnswer");
const { ensureAuthenticated } = require("./auth");

router.post("/answer", ensureAuthenticated, async (req, res) => {
  let userAnswer = await addUserAnswer(
    req.user,
    req.body.questionId,
    req.body.selectedOptionId
  );
  res.json({ correct: userAnswer.answeredCorrectly });
});

module.exports = router;
