const express = require("express");
const path = require("path");
const logger = require("morgan");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')

const app = express();

const mongodbURL = process.env.MONGODB_URL 

const scheduleRoutes = require("./routes/schedule");
const restrictionRoutes = require("./routes/restriction");

// view engine setup
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// other basic setup

app.use(express.urlencoded({ extended: false })); // Accept x-www-form-urlencoded
app.use(bodyParser.json())						  // Accept JSON
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

// connect to mongoose
mongoose
    .connect(mongodbURL)
    .then((result) => {
        console.log("Mongoose connection success");
    })
    .catch((error) => {
        console.log("Mongoose connection failed", error);
    });

// routers
app.use("/restriction", restrictionRoutes);
app.use("/", scheduleRoutes);

// export app (for tests)
module.exports = app;