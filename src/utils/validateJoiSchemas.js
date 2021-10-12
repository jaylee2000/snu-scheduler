const Joi = require('joi');
const { subjectSchema, subjectSchemaExtended, restrictionSchema, mustTakeGroupSchema } = require("./joiSchema.js");
const { ExpressError } = require("./ExpressError.js");
const { Subject } = require("../models/subject");

// Not middleware
const validateSubject = (subjectName, mon, tue, wed, thur, fri, weight, mustTake, credit, roomNum, remark, ownerstr) => {
	const { error } = subjectSchema.validate({
		subjectName, mon, tue, wed, thur, fri, weight, mustTake, credit, roomNum, remark, ownerstr
	})
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
}

const validateSubjectExtended = (subjectName, mon, tue, wed, thur, fri, weight, mustTake, credit, roomNum, remark, classification, college, department, degree, grade, subjectNum, classNum, lectureHours, labHours, formOfClass, prof, capacity, language) => {
	const { error } = subjectSchemaExtended.validate({
		subjectName, mon, tue, wed, thur, fri, weight, mustTake, credit, roomNum, remark, classification, college, department, degree, grade, subjectNum, classNum, lectureHours, labHours, formOfClass, prof, capacity, language
	})
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
}

const validateRestriction = (restrictionName, mon, tue, wed, thur, fri, ownerstr) => {
	const { error } = restrictionSchema.validate({
		restrictionName, mon, tue, wed, thur, fri, ownerstr
	})
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
}

const validateMustTakeGroup = (name, members, minSelection, maxSelection, ownerstr) => {
	const { error } = mustTakeGroupSchema.validate({
		name, members, minSelection, maxSelection, ownerstr
	})
	if(error) {
		console.log("Uh-oh");
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
}

const verifyMemberIDs = async (membersIDList) => {
	for (let memberID of membersIDList) {
		const subject = await Subject.findById(memberID);
		if(!subject) {
			throw new ExpressError('Subject member ID not found!', 400);
		}
	}
}

module.exports = { validateSubject, validateRestriction, validateMustTakeGroup, verifyMemberIDs };