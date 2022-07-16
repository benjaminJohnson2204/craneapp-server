const router = require("express").Router();
const passport = require("passport");
const { getQuestionsUnderCategory } = require("../db/services/question");

router.get("/category/:categoryId", async (req, res) => {
    let questions = await getQuestionsUnderCategory(req.params.categoryId);
    res.json({questions : questions/*, answeredQuestions : req.user.answeredQuestions*/}); 
 });


module.exports = router;