const { Subject } = require("../models/subject");
const { calculateMaxIntervalSum } = require("../functions/intervalScheduling");

const daysOfWeek = [ ['Monday', 'mon'], ['Tuesday', 'tue'], ['Wednesday', 'wed'], ['Thursday', 'thur'], ['Friday', 'fri'] ]

/* CRUD Functionality for Subjects */
// Create New Subject
module.exports.renderCreate = (req, res) => {
    res.render("new", { title: "SNU Scheduler" , daysOfWeek});
}
module.exports.createNewSubject = async (req, res) => {
    const { subject } = req.body;
    const newSubject = new Subject({
        subjectName: subject.subjectName,
        mon: {
            start: subject.mon[0],
            end: subject.mon[1],
        },
        tue: {
            start: subject.tue[0],
            end: subject.tue[1],
        },
        wed: {
            start: subject.wed[0],
            end: subject.wed[1],
        },
        thur: {
            start: subject.thur[0],
            end: subject.thur[1],
        },
        fri: {
            start: subject.fri[0],
            end: subject.fri[1],
        },
        weight: subject.weight,
    });
    await newSubject.save();
    res.redirect("/");
};

// Read All Subjects
module.exports.renderAllSubjects = async (req, res) => {
    const allSubjects = await Subject.find({});
    res.render("index", { title: "SNU Scheduler", allSubjects, daysOfWeek });
};

// Update Subject
module.exports.renderUpdate = async (req, res) => {
    const updateSubject = await Subject.findById(req.params.id);
    res.render("update", { title: "SNU Scheduler", updateSubject, daysOfWeek });
};
module.exports.updateSubject = async (req, res) => {
    const { subject } = req.body;
    const updateSubject = await Subject.findByIdAndUpdate(req.params.id, {
        subjectName: subject.subjectName,
        mon: {
            start: subject.start[0],
            end: subject.end[0],
        },
        tue: {
            start: subject.start[1],
            end: subject.end[1],
        },
        wed: {
            start: subject.start[2],
            end: subject.end[2],
        },
        thur: {
            start: subject.start[3],
            end: subject.end[3],
        },
        fri: {
            start: subject.start[4],
            end: subject.end[4],
        },
        weight: subject.weight,
    });
    await updateSubject.save();
    res.redirect("/");
};

// Delete Subject
module.exports.deleteSubject = async (req, res) => {
    const removeSubject = await Subject.findByIdAndDelete(req.params.id);
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
