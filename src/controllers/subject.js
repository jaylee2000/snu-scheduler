const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Subject } = require("../models/subject");
const { ProvidedSubject } = require("../models/providedSubject");
const { calculateMaxIntervalSum } = require("../functions/intervalScheduling");
const { parseTimeIntervals } = require("../functions/parseTimeIntervals");
const { generateRegexForSearch } = require("../functions/generateRegexForSearch");
const { createRenderScheduleObject } = require("../functions/createRenderScheduleObject");

const { ExpressError } = require("../utils/ExpressError");

const { daysOfWeek, mondayToFriday, timeSpan } = require("../definitions/arrays");
const { title } = require("../definitions/strings");
const { numSeeds, displayPerPage, pageChunkSize } = require("../definitions/constants");
const { validateSubject, validateSubjectExtended } = require("../utils/validateJoiSchemas");

const maxSubjectCount = 15;

/* CRUD Functionality for Subjects */
// Create New Subject
module.exports.renderCreate = (req, res) => {
    res.status(200).render("./subject/new", { title, daysOfWeek });
};
module.exports.parseInput = (req, res, next) => {
	const { mon, tue, wed, thur, fri } = req.body;
	
	const timeIntervals = parseTimeIntervals(mon, tue, wed, thur, fri);
	
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
	req.flash('success', 'Added new subject!');
    res.redirect("/subject");
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
    res.status(200).render("./subject/index", { title, allSubjects, daysOfWeek });
};

module.exports.showSubject = async (req, res) => {
	const subject = await Subject.findOne({_id: req.params.id});
	res.status(200).render("./subject/indexOne", { title, subject, daysOfWeek });
}

// Update Subject
module.exports.renderUpdate = async (req, res) => {
    const updateSubject = await Subject.findById(req.params.id);
    res.status(200).render("./subject/update", { title, updateSubject, daysOfWeek });
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
	
	req.flash('success', 'Updated subject!');
	
    res.redirect("/subject");
};

// Delete Subject
module.exports.deleteSubject = async (req, res) => {
    const removeSubject = await Subject.findByIdAndDelete(req.params.id);
	req.flash('success', 'Removed subject! Please update your Must-Take-Groups (Bundles).');
    res.redirect("/subject");
};

/*********************************************************************************************************************/

/* Add from Database */
module.exports.renderAddFromDatabase = (req, res) => {
	res.render("./database/index.ejs");
}

module.exports.renderDatabaseSearchResults = async (req, res, next) => {
	// Code reference: https://codeforgeek.com/server-side-pagination-using-node-and-mongo/
	// ex: https://backupofsnuscheduler-gtkkc.run.goorm.io/database/search?name=자구&pageNo=10&bigPage=1
	
	// Generate regex that contains name
	const regex = generateRegexForSearch(req.query.name);
	
	// Calculate page number for pagination
    const pageNo = parseInt(req.query.pageNo) || 1;
	const bigPage = parseInt(req.query.bigPage) || 0;
	const realpageNo = displayPerPage * pageChunkSize * bigPage + pageNo;
	
	// Backend pagination code for Node.js
    const query = {}
    if(realpageNo < 0 || realpageNo === 0 || pageNo < 0) {
		next(new ExpressError("Invalid page number", 400));
    }
  	query.skip = displayPerPage * (realpageNo - 1)
  	query.limit = displayPerPage
    ProvidedSubject.count({},function(err,totalCount) {
		 if(err) {
		   response = {"error" : true,"message" : "Error fetching data"}
		 }
		 ProvidedSubject.find({subjectName: {$regex: regex, $options: 'i'}},{},query,function(err,data) {
			  // Mongo command to fetch all data from collection.
			if(err) {
				response = {"error" : true,"message" : "Error fetching data"};
			} else {
				var totalPages = Math.ceil(totalCount / displayPerPage)
				response = {"error" : false,"message" : data,"pages": totalPages};
			}
		
			const candidates = response.message;
			const urlUpToName = req.originalUrl.split("&").shift();
			res.render("./database/searchResult.ejs", {candidates, urlUpToName, numSeeds, displayPerPage, bigPage, daysOfWeek});
		 });
	});
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
	
	req.flash('success', 'Added new subject!');
	
	res.redirect("/subject");
}

/*********************************************************************************************************************/

/* Optimize Schedule */
// Calculate
module.exports.calculateBestSchedules = async (req, res, next) => {
	// printTime('Middleware calculateBestSchedules called');
    const { maxCredit } = req.query;
	
	if(typeof Number(maxCredit) == 'number' && Number(maxCredit) != NaN) {
		if(0 <= maxCredit && maxCredit <= 30) {
			const possibleSchedules = await calculateMaxIntervalSum(maxCredit, req.user._id);
			// printTime('Calculated possibleSchedules');
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
	// printTime('Middleware displayBestSchedules called');
    const numDisplay =
        req.body.possibleSchedules.length >= 6
            ? 6
            : req.body.possibleSchedules.length;
	const object = createRenderScheduleObject(req.body.possibleSchedules);
    res.render("./schedule/best", {
        title: "Optimized Schedule",
        possibleSchedules: object,
		numDisplay,
		daysOfWeek,
		timeSpan
    });
	// printTime('Rendered page');
};




// function printTime(msg) {
	// Get time in ms
	// let loadTimeInMS = Date.now();
// 	let performanceNow = require("performance-now");
	
// 	const timeinMS = performanceNow()
	
	
// 	console.log(`${msg}: Current time is ${timeinMS}`);
// }