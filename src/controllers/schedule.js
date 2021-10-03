const { Subject } = require("../models/subject");
const { calculateMaxIntervalSum } = require("../functions/intervalScheduling");
const { parseSubjectInput } = require("../functions/parseSubjectInput");
const { generateYoilBlocks } = require("../functions/generateYoilBlocks");

const daysOfWeek = [ ['Monday', 'mon'], ['Tuesday', 'tue'], ['Wednesday', 'wed'], ['Thursday', 'thur'], ['Friday', 'fri'] ]

/* CRUD Functionality for Subjects */
// Create New Subject
module.exports.renderCreate = (req, res) => {
    res.render("new", { title: "SNU Scheduler" , daysOfWeek});
}
module.exports.createNewSubject = async (req, res) => {
    const { subjectName, mon, tue, wed, thur, fri, weight } = req.body;
	const subject = parseSubjectInput(mon, tue, wed, thur, fri);
	const yoilBlocks = generateYoilBlocks(subject);
    const newSubject = new Subject({
        subjectName,
        mon: yoilBlocks.monBlock,
		tue: yoilBlocks.tueBlock,
		wed: yoilBlocks.wedBlock,
		thur: yoilBlocks.thurBlock,
		fri: yoilBlocks.friBlock,
        weight
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
	const { subjectName, mon, tue, wed, thur, fri, weight } = req.body;
	const subject = parseSubjectInput(mon, tue, wed, thur, fri);
	const yoilBlocks = generateYoilBlocks(subject);
    const updateSubject = await Subject.findByIdAndUpdate(req.params.id, {
        subjectName,
        mon: yoilBlocks.monBlock,
		tue: yoilBlocks.tueBlock,
		wed: yoilBlocks.wedBlock,
		thur: yoilBlocks.thurBlock,
		fri: yoilBlocks.friBlock,
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
	console.log(possibleSchedules) // <-- Check this out.
    req.body.possibleSchedules = possibleSchedules;
    next();
};
// Render
module.exports.displayBestSchedules = (req, res) => {
    const numDisplay =
        req.body.possibleSchedules.length >= 6 
			? 
		  6 : req.body.possibleSchedules.length;
    res.render("best", {
        title: "Optimized Schedule",
        possibleSchedules: req.body.possibleSchedules,
        numDisplay,
		daysOfWeek
    });
};
