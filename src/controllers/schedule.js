const { Subject } = require("../models/subject");
const { Restriction } = require("../models/restriction");
const { calculateMaxIntervalSum } = require("../functions/intervalScheduling");
const { parseSubjectInput } = require("../functions/parseSubjectInput");
const { generateYoilBlocks } = require("../functions/generateYoilBlocks");
const {
    convertNullToEmptyArray,
} = require("../functions/convertNullToEmptyArray_Yoil");
const { daysOfWeek } = require("../definitions/arrays");
const { validateSubject } = require("../utils/validateJoiSchemas");
const thisIsASubjectCreatedByUser = "dskjahgjh328478935daghjghjdf045902304asdfgjadgkljg435dasgghdfg348ghdjfsgh9458asdfhkgjadsd";

/* CRUD Functionality for Subjects */
// Create New Subject
module.exports.renderCreate = (req, res) => {
    res.status(200).render("./schedule/new", {
        title: "SNU Scheduler",
        daysOfWeek,
    });
};
module.exports.createNewSubject = async (req, res) => {
    const { subjectName, mon, tue, wed, thur, fri, weight, mustTake, credit, roomNum, remark } =
        req.body;
    const subject = parseSubjectInput(mon, tue, wed, thur, fri);
    convertNullToEmptyArray(subject);
    const yoilBlocks = generateYoilBlocks(subject);
	const ownerstr = req.user._id.toString();
	validateSubject(subjectName, yoilBlocks.monBlock, yoilBlocks.tueBlock, yoilBlocks.wedBlock, yoilBlocks.thurBlock, yoilBlocks.friBlock, weight, mustTake, credit,
				   roomNum, remark, ownerstr);
    const newSubject = new Subject({
        subjectName,
        mon: yoilBlocks.monBlock,
        tue: yoilBlocks.tueBlock,
        wed: yoilBlocks.wedBlock,
        thur: yoilBlocks.thurBlock,
        fri: yoilBlocks.friBlock,
        weight,
        mustTake: mustTake === "true" ? true : false,
        credit,
		roomNum,
		remark
    });
	newSubject.owner = req.user._id;
    await newSubject.save();
    res.redirect("/");
};

// Read All Subjects
module.exports.renderAllSubjects = async (req, res) => {
    const allSubjects = await Subject.find({owner: req.user._id}); // Show only MY shopping cart.
    res.status(200).render("./schedule/index", {
        title: "SNU Scheduler",
        allSubjects,
        daysOfWeek,
    });
};

// Update Subject
module.exports.renderUpdate = async (req, res) => {
    const updateSubject = await Subject.findById(req.params.id);
    res.status(200).render("./schedule/update", {
        title: "SNU Scheduler",
        updateSubject,
        daysOfWeek,
    });
};
module.exports.updateSubject = async (req, res) => {
    const { subjectName, mon, tue, wed, thur, fri, weight, mustTake, credit, 
		   roomNum, remark,
		   classification = thisIsASubjectCreatedByUser, college, department, degree, grade,
		   subjectNum, classNum, lectureHours, labHours, formOfClass, prof, capacity, language
		  } =
        req.body;
    const subject = parseSubjectInput(mon, tue, wed, thur, fri);
    convertNullToEmptyArray(subject);
    const yoilBlocks = generateYoilBlocks(subject);
	const ownerstr = req.user._id.toString();
	validateSubject(subjectName, yoilBlocks.monBlock, yoilBlocks.tueBlock, yoilBlocks.wedBlock, yoilBlocks.thurBlock, yoilBlocks.friBlock, weight, mustTake, credit,
				   roomNum, remark, ownerstr);
	if(classification === thisIsASubjectCreatedByUser) {
		const updateSubject = await Subject.findByIdAndUpdate(req.params.id, {
			subjectName,
			mon: yoilBlocks.monBlock,
			tue: yoilBlocks.tueBlock,
			wed: yoilBlocks.wedBlock,
			thur: yoilBlocks.thurBlock,
			fri: yoilBlocks.friBlock,
			weight: subject.weight,
			mustTake: mustTake === "true" ? true : false,
			credit,
			roomNum, remark
		});
		updateSubject.owner = req.user._id;
		await updateSubject.save();
	} else {
		const updateSubject = await Subject.findByIdAndUpdate(req.params.id, {
			subjectName,
			mon: yoilBlocks.monBlock,
			tue: yoilBlocks.tueBlock,
			wed: yoilBlocks.wedBlock,
			thur: yoilBlocks.thurBlock,
			fri: yoilBlocks.friBlock,
			weight: subject.weight,
			mustTake: mustTake === "true" ? true : false,
			credit,
			roomNum, remark,
			classification, college, department, degree, grade, subjectNum, classNum, lectureHours, labHours, formOfClass, prof, capacity, language
		});
		updateSubject.owner = req.user._id;
		await updateSubject.save();
	}
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
