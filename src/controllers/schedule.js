const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Subject } = require("../models/subject");
const { ProvidedSubject } = require("../models/providedSubject");
const { calculateMaxIntervalSum } = require("../functions/intervalScheduling");
const { subjectParse } = require("../functions/subjectParse.js");

const { daysOfWeek, mondayToFriday } = require("../definitions/arrays");
const { title } = require("../definitions/strings");
const { validateSubject, validateSubjectExtended } = require("../utils/validateJoiSchemas");

const maxSubjectCount = 15;

/* CRUD Functionality for Subjects */
// Create New Subject
module.exports.renderCreate = async (req, res) => {
    res.status(200).render("./schedule/new", { title, daysOfWeek });
};
module.exports.parseInput = (req, res, next) => {
	const { mon, tue, wed, thur, fri } = req.body;
	
	const timeIntervals = subjectParse(mon, tue, wed, thur, fri);
	
	for(let day of mondayToFriday) {
		req.body[day] = timeIntervals[day];
	}
	
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
module.exports.checkMaxSubjectCount = async (req, res, next) => {
	const mySubjects = await Subject.find({owner: req.user._id});
	if(mySubjects.length >= 15) {
		return res.status(400).send("Maximum 15 subjects can be added to your cart.");
	} else {
		next();
	}
}

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
    req.body.ownerstr = req.user._id.toString();
	
	if(req.body.classification) { // from providedSubject
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

/* Add from Database */
module.exports.renderAddFromDatabase = async (req, res) => {
	res.render("./database/index.ejs");
}

module.exports.renderDatabaseSearchResults = async (req, res) => {
	const {name} = req.query;
	const candidates = await ProvidedSubject.find({subjectName: name});
	res.render("./database/searchResult.ejs", {candidates});
}

module.exports.addSubjectFromDatabase = async (req, res) => {
	const { weight = 1, mustTake = false } = req.body;
	const selectedSubject = await ProvidedSubject.findById(req.params.id);
	if(weight) selectedSubject.weight = weight;
	if(mustTake) selectedSubject.mustTake = mustTake;

	const saveSubject = new Subject(selectedSubject);
	saveSubject.owner = req.user._id;
	saveSubject._id = mongoose.Types.ObjectId();
	saveSubject.isNew = true;
	await saveSubject.save();
	res.redirect("/");
}

/*********************************************************************************************************************/

/* Optimize Schedule */
// Calculate
module.exports.calculateBestSchedules = async (req, res, next) => {
    const { maxCredit } = req.query;
	
	if(typeof Number(maxCredit) == 'number' && Number(maxCredit) != NaN) {
		if(0 <= maxCredit && maxCredit <= 30) {
			const possibleSchedules = await calculateMaxIntervalSum(maxCredit, req.user._id);
			req.body.possibleSchedules = possibleSchedules;
			next();
		}
	}
	else {
		next(new Error('Invalid input for maxCredit. maxCredit must be between 0 and 30.'));
	}
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
