const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  findUserByUsername,
  addUser,
  findUserByID,
} = require("../db/services/user");

const ensureAuthenticated = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.redirect("/auth/invalid");
  const verified = jwt.verify(token, "passwordKey");
  if (!verified) return res.redirect("/auth/invalid");
  req.user = await findUserByID(verified.id);
  return next();
};

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/auth/invalid" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, "passwordKey");
    res.json({ token, ...req.user._doc });
  }
);

router.get("/invalid", (req, res) => {
  res.status(401).json({ error: "You are not authenticated" });
});

router.post(
  "/register",
  async (req, res, next) => {
    if (req.body.password != req.body.confirm) {
      res.json({ error: "passwords don't match" });
      return;
    }
    const hash = bcrypt.hashSync(req.body.password, 12);
    let user = await findUserByUsername(req.body.username);
    if (user) {
      res.json({ error: "username already taken" });
      return;
    }
    let addedUser = await addUser(req.body.username, hash);
    if (addedUser) {
      req.login(addedUser, (error) => {
        if (error) {
          console.log(error);
          return next(error);
        }
        return next(null, addedUser);
      });
    } else {
      res.json({ error: "could not register user" });
    }
  },
  passport.authenticate("local"),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, "passwordKey");
    res.json({ token, ...req.user._doc });
  }
);

router.get("/authenticated", (req, res) => {
  res.json({ authenticated: req.isAuthenticated() });
});

router.post("/tokenIsValid", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.json({ valid: false });
  const verified = jwt.verify(token, "passwordKey");
  if (!verified) return res.json({ valid: false });
  res.json({ valid: true });
});

router.post("/logout", (req, res) => {
  try {
    req.logout({}, (error) => {
      if (error) {
        console.error(error.message);
        res.json({ result: "error" });
      } else {
        res.json({ result: "success" });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.json({ result: "error" });
  }
});

router.get("/user", ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { router, ensureAuthenticated };
