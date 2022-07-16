const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path : path.join(__dirname, ".env")});

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
// const testRunner = require("../test-runner");

const app = express();
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser : true });

const { User } = require("./db/models/user");
const { findUserByID, findUserByUsername } = require("./db/services/user");


app.use(cookieParser());

// app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());


app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : true,
    saveUninitialized : true,
    cookie : { 
        maxAge : 3600_000,
        secure : false
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    console.log(id);
    let user = await findUserByID(id);
    done(null, user);
});

passport.use(new LocalStrategy(
    async (username, password, done) => {
        let user = await findUserByUsername(username);
        if (!user) {
            return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.hashedPassword)) {
            return done(null, false);
        }
        return done(null, user);
    }
));


app.use("/auth", require("./routes/auth"));
app.use("/category", require("./routes/category"));
app.use("/question", require("./routes/question"));
app.use("/userAnswer", require("./routes/userAnswer"));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});