const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../index");
const bcrypt = require("bcrypt");
const mongoUnit = require("mongo-unit");
const { User } = require("../db/models/user");
const { Question } = require("../db/models/question");

const assert = chai.assert;
chai.use(chaiHttp);

let token, testQuestion;

describe("Question Tests", () => {
  before(async () => {
    await User.create({
      username: "Test1",
      hashedPassword: bcrypt.hashSync("123", 12),
    });
    testQuestion = await Question.create({
      category: "Test Category",
      questionText: "Test Question",
      options: [
        {
          text: "Correct answer",
          explanation: "This is the correct answer",
          index: 1,
          isCorrect: true,
        },
        {
          text: "Wrong answer",
          explanation: "This is a wrong answer",
          index: 2,
          isCorrect: false,
        },
        {
          text: "Wrong answer 2",
          explanation: "This is another wrong answer",
          index: 3,
          isCorrect: false,
        },
      ],
    });
    chai
      .request(app)
      .post("/auth/login")
      .send({
        username: "Test1",
        password: "123",
      })
      .end((err, res) => {
        token = res.body.token;
      });
  });

  after(async () => {
    await mongoUnit.drop();
  });

  it("Get all categories", (done) => {
    chai
      .request(app)
      .get("/category/all")
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.categories.length, 1);
        console.log(res.body.categories);
        assert.equal(res.body.categories[0], "Test Category");
        done();
      });
  });

  it("Get questions under category", (done) => {
    chai
      .request(app)
      .get(`/question/category/Test Category`)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.questions.length, 1);
        assert.equal(res.body.questions[0].questionText, "Test Question");
        done();
      });
  });

  it("Get question by ID", (done) => {
    chai
      .request(app)
      .get(`/question/${testQuestion._id}`)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.question.questionText, "Test Question");
        assert.equal(res.body.question.options.length, 3);
        done();
      });
  });

  it("Get fraction of questions answered by category with no questions answered", (done) => {
    chai
      .request(app)
      .get(`/question/fractionComplete/Test Category`)
      .set("x-auth-token", token)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.total, 1);
        assert.equal(res.body.correct, 0);
        done();
      });
  });

  it("Get fraction of questions answered total with no questions answered", (done) => {
    chai
      .request(app)
      .get(`/question/fractionComplete`)
      .set("x-auth-token", token)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].category, "Test Category");
        assert.equal(res.body[0].total, 1);
        assert.equal(res.body[0].correct, 0);
        done();
      });
  });

  it("Cannot post or get answers without auth token", (done) => {
    chai
      .request(app)
      .post("/userAnswer/answer")
      .send({
        questionId: testQuestion._id,
        selectedOptionIndex: 1,
      })
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 401);
        chai
          .request(app)
          .get("/userAnswer/all")
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 401);
            chai
              .request(app)
              .get(`/userAnswer/category/Test Category`)
              .end((err, res) => {
                assert.isNull(err);
                assert.equal(res.status, 401);
                chai
                  .request(app)
                  .get(`/userAnswer/question/${testQuestion._id}`)
                  .end((err, res) => {
                    assert.isNull(err);
                    assert.equal(res.status, 401);
                    done();
                  });
              });
          });
      });
  });

  it("Answer question correctly", (done) => {
    chai
      .request(app)
      .post("/userAnswer/answer")
      .set("x-auth-token", token)
      .send({
        questionId: testQuestion._id,
        selectedOptionIndex: 1,
      })
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.correct, true);
        done();
      });
  });

  it("Answer question incorrectly", (done) => {
    chai
      .request(app)
      .post("/userAnswer/answer")
      .set("x-auth-token", token)
      .send({
        questionId: testQuestion._id,
        selectedOptionIndex: 2,
      })
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.correct, false);
        done();
      });
  });

  it("Provide duplicate answer", (done) => {
    chai
      .request(app)
      .post("/userAnswer/answer")
      .set("x-auth-token", token)
      .send({
        questionId: testQuestion._id,
        selectedOptionIndex: 2,
      })
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 400);
        done();
      });
  });

  it("Get all answers", (done) => {
    chai
      .request(app)
      .get("/userAnswer/all")
      .set("x-auth-token", token)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.userAnswers.length, 2);
        assert.equal(res.body.userAnswers[0].question, testQuestion._id);
        assert.equal(res.body.userAnswers[1].question, testQuestion._id);
        if (res.body.userAnswers[0].answeredCorrectly) {
          assert.equal(res.body.userAnswers[0].selectedOptionIndex, 1);
          assert.equal(res.body.userAnswers[1].selectedOptionIndex, 2);
        } else {
          assert.equal(res.body.userAnswers[0].selectedOptionIndex, 2);
          assert.equal(res.body.userAnswers[1].selectedOptionIndex, 1);
        }
        done();
      });
  });

  it("Get answers by category", (done) => {
    chai
      .request(app)
      .get(`/userAnswer/category/Test Category`)
      .set("x-auth-token", token)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.userAnswers.length, 2);
        done();
      });
  });

  it("Get answers by question", (done) => {
    chai
      .request(app)
      .get(`/userAnswer/question/${testQuestion._id}`)
      .set("x-auth-token", token)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.userAnswers.length, 2);
        done();
      });
  });

  it("Get fraction of questions answered correctly by category", (done) => {
    chai
      .request(app)
      .get(`/question/fractionComplete/Test Category`)
      .set("x-auth-token", token)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.total, 1);
        assert.equal(res.body.correct, 1);
        done();
      });
  });

  it("Get fraction of questions answered correctly for each category", (done) => {
    chai
      .request(app)
      .get(`/question/fractionComplete`)
      .set("x-auth-token", token)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].category, "Test Category");
        assert.equal(res.body[0].total, 1);
        assert.equal(res.body[0].correct, 1);
        done();
      });
  });
});
