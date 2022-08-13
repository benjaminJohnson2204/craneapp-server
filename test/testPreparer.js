const prepare = require("mocha-prepare");
const mongoUnit = require("mongo-unit");
const { connectToMongoose } = require("../index");

prepare((done) => {
  mongoUnit.start().then((testMongoUrl) => {
    process.env.MONGO_URI = testMongoUrl;
    connectToMongoose().then(() => done());
  });
});
