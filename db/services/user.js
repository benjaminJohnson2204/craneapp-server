const { User } = require("../models/user");

const findUserByUsername = async (username) => {
  try {
    let user = await User.findOne({ username: username });
    return user;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

const findUserByID = async (id) => {
  try {
    let user = await User.findById(id);
    return user;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

const addUser = async (username, password) => {
  try {
    let user = await User.create({
      username: username,
      hashedPassword: password,
    });
    return user;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

module.exports = {
  findUserByUsername,
  findUserByID,
  addUser,
};
