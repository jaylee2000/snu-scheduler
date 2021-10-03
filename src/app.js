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
    process.env.MONGODB_URL || "mongodb://localhost:27017/snu-scheduler-2";

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
    const possibleSchedules = await calculateMaxIntervalSum();
	// display best 1 possible schedule (for now, just 1)
    res.render("best", { title: "Optimized Schedule", optimizedSchedule: possibleSchedules[0] });
});

app.get("/new", (req, res) => {
    res.render("new", { title: "SNU Scheduler" });
});

app.get("/update/:id", async (req, res) => {
	const updateSchedule = await Schedule.findById(req.params.id);
	res.render("update", {title: "SNU Scheduler", updateSchedule});
})

app.patch("/:id", async (req, res) => {
	const { schedule } = req.body;
	const updateSchedule = await Schedule.findByIdAndUpdate(req.params.id, {
		subjectName: schedule.subjectName,
		mon: {
			start: schedule.start[0], end: schedule.end[0]
		},
		tue: {
			start: schedule.start[1], end: schedule.end[1]
		},
		wed: {
			start: schedule.start[2], end: schedule.end[2]
		},
		thur: {
			start: schedule.start[3], end: schedule.end[3]
		},
		fri: {
			start: schedule.start[4], end: schedule.end[4]
		},
		weight: schedule.weight
	});
	console.log(updateSchedule)
	await updateSchedule.save();
	res.redirect("/");
})

app.delete("/:id", async (req, res) => {
	const removeSchedule = await Schedule.findByIdAndDelete(req.params.id);
	res.redirect("/");
})

app.post("/", async (req, res) => {
    const { schedule } = req.body;
	// console.log(schedule)
	const newSchedule = new Schedule({
		subjectName: schedule.subjectName,
		mon: {
			start: schedule.mon[0],
			end: schedule.mon[1]
		},
		tue: {
			start: schedule.tue[0],
			end: schedule.tue[1]
		},
		wed: {
			start: schedule.wed[0],
			end: schedule.wed[1]
		},
		thur: {
			start: schedule.thur[0],
			end: schedule.thur[1]
		},
		fri: {
			start: schedule.fri[0],
			end: schedule.fri[1]
		},
		weight: schedule.weight
	})
	console.log(newSchedule);
    await newSchedule.save();
    res.redirect("/");
});

app.listen(port, () => console.log(`App listening on port ${port}`));
