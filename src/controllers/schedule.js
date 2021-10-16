const { Subject } = require("../models/subject");
const { Restriction } = require("../models/restriction");
const { calculateMaxIntervalSum } = require("../functions/intervalScheduling");
const { parseSubjectInput } = require("../functions/parseSubjectInput");
const { generateYoilBlocks } = require("../functions/generateYoilBlocks");
const { convertNullToEmptyArray } = require("../functions/convertNullToEmptyArray_Yoil");
const { daysOfWeek } = require("../definitions/arrays");
const { title } = require("../definitions/strings");
const { validateSubject, validateSubjectExtended } = require("../utils/validateJoiSchemas");
const thisIsASubjectCreatedByUser = "dskjahgjh328478935daghjghjdf045902304asdfgjadgkljg435dasgghdfg348ghdjfsgh9458asdfhkgjadsd";

/* CRUD Functionality for Subjects */
// Create New Subject
module.exports.renderCreate = (req, res) => {
    res.status(200).render("./schedule/new", { title, daysOfWeek });
};

module.exports.parseInput = (req, res, next) => {
	const { mon, tue, wed, thur, fri } = req.body;
	const subject = parseSubjectInput(mon, tue, wed, thur, fri);
	convertNullToEmptyArray(subject);
	const yoilBlocks = generateYoilBlocks(subject);
	console.log(yoilBlocks);
	
	req.body.mon = yoilBlocks.monBlock;
	req.body.tue = yoilBlocks.tueBlock;
	req.body.wed = yoilBlocks.wedBlock;
	req.body.thur = yoilBlocks.thurBlock;
	req.body.fri = yoilBlocks.friBlock;
	
	req.body.mustTake = req.body.mustTake === "true" ? true : false;
	
	next();
}

module.exports.createNewSubject = async (req, res) => {
	req.body.ownerstr = req.user._id.toString();
	validateSubject(req.body);
	
    const newSubject = new Subject(req.body);
	newSubject.owner = req.user._id;
    await newSubject.save();
    res.redirect("/");
};

// Read All Subjects
module.exports.renderAllSubjects = async (req, res) => {
    const allSubjects = await Subject.find({owner: req.user._id}); // Show only MY shopping cart.
    res.status(200).render("./schedule/index", { title, allSubjects, daysOfWeek });
};

// Update Subject
module.exports.renderUpdate = async (req, res) => {
    const updateSubject = await Subject.findById(req.params.id);
    res.status(200).render("./schedule/update", { title, updateSubject, daysOfWeek });
};
module.exports.updateSubject = async (req, res) => {
	console.log(req.body);
	
    req.body.ownerstr = req.user._id.toString();
	if(req.body.classification) { // from providedSubject
		console.log(req.body.mon);
		validateSubjectExtended(req.body);
	} else {
		validateSubject(req.body);
	}
	
	req.body.owner = req.user._id;
	await Subject.findByIdAndUpdate(req.params.id, req.body);
	
    res.redirect("/");
};

// Delete Subject
module.exports.deleteSubject = async (req, res) => {
    const removeSubject = await Subject.findByIdAndDelete(req.params.id);
    res.redirect("/");
};

/*********************************************************************************************************************/

/*********************************************************************************************************************/

/* Optimize Schedule */
// Calculate
module.exports.calculateBestSchedules = async (req, res, next) => {
    const { maxCredit } = req.query;

    // validate that maxCredit is a number... between sth and sth...
    const possibleSchedules = await calculateMaxIntervalSum(maxCredit);
    req.body.possibleSchedules = possibleSchedules;
    next();
};
// Render
module.exports.displayBestSchedules = (req, res) => {
    const numDisplay =
        req.body.possibleSchedules.length >= 6
            ? 6
            : req.body.possibleSchedules.length;
    res.render("./schedule/best", {
        title: "Optimized Schedule",
        possibleSchedules: req.body.possibleSchedules,
        numDisplay,
        daysOfWeek,
    });
};
