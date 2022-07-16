const router = require("express").Router();
const passport = require("passport");
const { addUserAnswer, answeredCorrectly } = require("../db/services/userAnswer");


router.post("/answer", passport.authenticate("local", {failureRedirect : "/auth/invalid"}), async (req, res) => {
    let userAnswer = await addUserAnswer(req.user, req.body.questionId, req.body.selectedOptionId);
    req.user.answeredQuestions.append(userAnswer);
    await req.user.save();
    res.json({correct : userAnswer.answeredCorrectly});
});

module.exports = router;