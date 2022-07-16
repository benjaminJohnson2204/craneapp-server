const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { findUserByID, findUserByUsername, addUser } = require("../db/services/user");


const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/invalid");
}

router.post("/login", passport.authenticate("local", {failureRedirect : "/auth/invalid"}), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, "passwordKey");
    res.json({ token, ...req.user._doc });
});

router.get("/invalid", (req, res) => {
    res.json({"error" : "You are not authenticated"});
})

router.post("/register", async (req, res, next) => {
    if (req.body.password != req.body.confirm) {
        res.json({"error" : "passwords don't match"});
        return;
    }
    const hash = bcrypt.hashSync(req.body.password, 12);
    let user = await findUserByUsername(req.body.username);
    if (user) {
        res.json({"error" : "username already taken"});
        return;
    }
    let addedUser = await addUser(req.body.username, hash)
    if (addedUser) {
        req.login(addedUser, error => {
            if (error) {
                console.log(error);
                return next(error);
            }
            return next(null, addedUser);
        });
    } else {
        res.json({"error" : "could not register user"});
    }
}, passport.authenticate("local"), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, "passwordKey");
    res.json({ token, ...req.user._doc });
});

router.get("/authenticated", (req, res) => {
    res.json({"authenticated" : req.isAuthenticated()});
});

router.post("/tokenIsValid", (req, res) => {    
    const token = req.header("x-auth-token");
    if (!token) return res.json({"valid" : false});
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json({"valid" : false});
    res.json({"valid" : true});
});

router.get("/logout", (req, res) => {
    try {
        req.logout({}, error => {
            if (error) {
                console.error(error.message);
                res.json({ "result" : "error"});
            } else {
                res.json({ "result" : "success"});
            }
        });
    } catch (error) {
        console.error(error.message);
        res.json({ "result" : "error"});;
    }
});

router.get("/user", ensureAuthenticated, (req, res) => {
    res.json({"user" : req.user});
})


module.exports = router;