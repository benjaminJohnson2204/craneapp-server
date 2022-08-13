const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../index");
const bcrypt = require("bcrypt");
const mongoUnit = require("mongo-unit");
const { User } = require("../db/models/user");

const assert = chai.assert;
chai.use(chaiHttp);

let token;

describe("Authentication Tests", () => {
  before(async () => {
    await User.create({
      username: "Test1",
      hashedPassword: bcrypt.hashSync("123", 12),
    });
  });

  after(async () => {
    await mongoUnit.drop();
  });

  it("Register a user", (done) => {
    chai
      .request(app)
      .post("/auth/register")
      .send({
        username: "Test2",
        password: "123",
        confirm: "123",
      })
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        token = res.body.token;
        assert.ok(token);
        done();
      });
  });

  it("Login valid user", (done) => {
    chai
      .request(app)
      .post("/auth/login")
      .send({
        username: "Test1",
        password: "123",
      })
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        token = res.body.token;
        assert.ok(token);
        done();
      });
  });

  it("Get user data with token", (done) => {
    chai
      .request(app)
      .get("/auth/user")
      .set("x-auth-token", token)
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.user.username, "Test1");
        done();
      });
  });

  it("Logout user", (done) => {
    chai
      .request(app)
      .post("/auth/logout")
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 200);
        done();
      });
  });

  it("Get user data without token", (done) => {
    chai
      .request(app)
      .get("/auth/user")
      .end((err, res) => {
        assert.isNull(err);
        assert.equal(res.status, 401);
        done();
      });
  });
});
