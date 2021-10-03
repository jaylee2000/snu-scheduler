const { Schedule } = require("../models/schedule");
const { calculateMaxIntervalSum } = require("../functions/intervalScheduling");

const daysOfWeek = [ ['Monday', 'mon'], ['Tuesday', 'tue'], ['Wednesday', 'wed'], ['Thursday', 'thur'], ['Friday', 'fri'] ]

/* CRUD Functionality for Subjects */
// Create New Subject
module.exports.renderCreate = (req, res) => {
    res.render("new", { title: "SNU Scheduler" , daysOfWeek});
}
module.exports.createNewSubject = async (req, res) => {
    const { schedule } = req.body;
    const newSchedule = new Schedule({
        subjectName: schedule.subjectName,
        mon: {
            start: schedule.mon[0],
            end: schedule.mon[1],
        },
        tue: {
            start: schedule.tue[0],
            end: schedule.tue[1],
        },
        wed: {
            start: schedule.wed[0],
            end: schedule.wed[1],
        },
        thur: {
            start: schedule.thur[0],
            end: schedule.thur[1],
        },
        fri: {
            start: schedule.fri[0],
            end: schedule.fri[1],
        },
        weight: schedule.weight,
    });
    await newSchedule.save();
    res.redirect("/");
};

// Read All Subjects
module.exports.renderAllSubjects = async (req, res) => {
    const allSchedules = await Schedule.find({});
    res.render("index", { title: "SNU Scheduler", allSchedules, daysOfWeek });
};

// Update Subject
module.exports.renderUpdate = async (req, res) => {
    const updateSchedule = await Schedule.findById(req.params.id);
    res.render("update", { title: "SNU Scheduler", updateSchedule, daysOfWeek });
};
module.exports.updateSubject = async (req, res) => {
    const { schedule } = req.body;
    const updateSchedule = await Schedule.findByIdAndUpdate(req.params.id, {
        subjectName: schedule.subjectName,
        mon: {
            start: schedule.start[0],
            end: schedule.end[0],
        },
        tue: {
            start: schedule.start[1],
            end: schedule.end[1],
        },
        wed: {
            start: schedule.start[2],
            end: schedule.end[2],
        },
        thur: {
            start: schedule.start[3],
            end: schedule.end[3],
        },
        fri: {
            start: schedule.start[4],
            end: schedule.end[4],
        },
        weight: schedule.weight,
    });
    await updateSchedule.save();
    res.redirect("/");
};

// Delete Subject
module.exports.deleteSubject = async (req, res) => {
    const removeSchedule = await Schedule.findByIdAndDelete(req.params.id);
    res.redirect("/");
};

/*********************************************************************************************************************/

/* Optimize Schedule */
// Calculate
module.exports.calculateBestSchedules = async (req, res, next) => {
    const possibleSchedules = await calculateMaxIntervalSum();
    req.body.possibleSchedules = possibleSchedules;
    next();
};
// Render
module.exports.displayBestSchedules = (req, res) => {
    const numDisplay =
        req.body.possibleSchedules.length >= 6
            ? 6
            : req.body.possibleSchedules.length;
    res.render("best", {
        title: "Optimized Schedule",
        possibleSchedules: req.body.possibleSchedules,
        numDisplay,
		daysOfWeek
    });
};
