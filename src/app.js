const express = require("express");
const path = require("path");
const logger = require("morgan");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const { calculateMaxIntervalSum } = require("../functions/intervalScheduling");
const { Schedule } = require("../database/schedule");

const app = express();

const port = process.env.PORT || 3000;
const mongodbURL =
    process.env.MONGODB_URL || "mongodb://localhost:27017/snu-scheduler";

// view engine setup
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// other basic setup
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

mongoose
    .connect(mongodbURL)
    .then((result) => {
        console.log("Mongoose connection success");
    })
    .catch((error) => {
        console.log("Mongoose connection failed", error);
    });

app.get("/", async (req, res) => {
    const allSchedules = await Schedule.find({});
    res.render("index", { title: "SNU Scheduler", allSchedules });
});

app.get("/best", async (req, res) => {
    const optimizedSchdule = await calculateMaxIntervalSum();
    res.render("best", { title: "Optimized Schedule", optimizedSchdule });
});

app.get("/new", (req, res) => {
    res.render("new", { title: "SNU Scheduler" });
});

app.get("/update/:id", async (req, res) => {
	const updateSchedule = await Schedule.findById(req.params.id);
	res.render("update", {title: "SNU Scheduler", updateSchedule});
})

app.patch("/:id", async (req, res) => {
	const updateSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body.schedule);
	await updateSchedule.save();
	res.redirect("/");
})

app.delete("/:id", async (req, res) => {
	const removeSchedule = await Schedule.findByIdAndDelete(req.params.id);
	res.redirect("/");
})

app.post("/", async (req, res) => {
    const { schedule } = req.body;
    const newSchedule = new Schedule(schedule);
    await newSchedule.save();
    res.redirect("/");
});

app.listen(port, () => console.log(`App listening on port ${port}`));
