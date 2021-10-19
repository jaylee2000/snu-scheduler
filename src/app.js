const express = require("express");
const path = require("path");
const logger = require("morgan");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('cookie-session');
const flash = require('connect-flash');

// Auth
const { User, UserSchema } = require("./models/user.js");
const passport = require('passport')
const LocalStrategy = require('passport-local')

const app = express();

const mongodbURL = process.env.MONGODB_URL;

const subjectRoutes = require("./routes/subject");
const restrictionRoutes = require("./routes/restriction");
const mustTakeGroupRoutes = require("./routes/mustTakeGroup");
const addFromDatabaseRoutes = require("./routes/addFromDatabase");
const userRoutes = require("./routes/user");

// view engine setup
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// other basic setup
app.use(express.urlencoded({ extended: false })); // Accept x-www-form-urlencoded
if (process.env.MODE === "TEST") {
    app.use(bodyParser.json()); // Accept JSON
}
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
if (process.env.MODE === "DEV") {
    app.use(logger("dev"));
}

// connect to mongoDB via mongoose
mongoose
    .connect(mongodbURL)
    .then((result) => {
        if (process.env.MODE === "DEV")
            console.log("Mongoose connection success");
    })
    .catch((error) => {
        if (process.env.MODE === "DEV")
            console.log("Mongoose connection failed", error);
    });


// Sessions
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Auth
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash, currentUser
app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.currentUser = req.user;
	next();
})


// routers
app.use("/restriction", restrictionRoutes);
app.use("/subject", subjectRoutes);
app.use("/musttake", mustTakeGroupRoutes);
app.use("/database", addFromDatabaseRoutes);
app.use("/", userRoutes);

// Handling errors
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
	if(err.message.includes('duplicate')) {
		err.message = err.message.replace('duplicate', 'duplicate and/or non-ascending');
	}
	req.flash('error', 'An error occurred!');
    res.status(statusCode).render('error', { err })
})

// export app (for tests)
module.exports = app;
