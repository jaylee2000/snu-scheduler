const Joi = require('joi');
const { subjectSchema, restrictionSchema, mustTakeGroupSchema } = require("./joiSchema.js");
const { ExpressError } = require("./ExpressError.js");
const { Subject } = require("../models/subject");

// Not middleware
const validateSubject = (subjectName, mon, tue, wed, thur, fri, weight, mustTake, credit) => {
	const { error } = subjectSchema.validate({
		subjectName, mon, tue, wed, thur, fri, weight, mustTake, credit
	})
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
}

const validateRestriction = (restrictionName, mon, tue, wed, thur, fri) => {
	const { error } = restrictionSchema.validate({
		restrictionName, mon, tue, wed, thur, fri
	})
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
}

const validateMustTakeGroup = (name, members, minSelection, maxSelection) => {
	const { error } = mustTakeGroupSchema.validate({
		name, members, minSelection, maxSelection
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