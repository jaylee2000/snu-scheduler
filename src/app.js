const express = require("express");
const path = require("path");
const logger = require("morgan");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 3000;
const mongodbURL =
    process.env.MONGODB_URL || "mongodb://localhost:27017/snu-scheduler-2";

const scheduleRoutes = require("./routes/schedule");

// view engine setup
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// other basic setup
app.use(express.urlencoded({ extended: true }));
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
app.use("/", scheduleRoutes);

// connect to port
app.listen(port, () => console.log(`App listening on port ${port}`));
