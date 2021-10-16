const Joi = require('joi');
const { subjectSchema, subjectSchemaExtended, restrictionSchema, mustTakeGroupSchema } = require("./joiSchema.js");
const { ExpressError } = require("./ExpressError.js");
const { Subject } = require("../models/subject");

// Not middleware
const validateSubject = (subjectObj) => {
	const { error } = subjectSchema.validate(subjectObj)
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
}

const validateSubjectExtended = (providedSubjectObj) => {
	const { error } = subjectSchemaExtended.validate(providedSubjectObj)
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
}

const validateRestriction = (restrictionObj) => {
	const { error } = restrictionSchema.validate(restrictionObj)
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

module.exports = { validateSubject, validateSubjectExtended, validateRestriction, validateMustTakeGroup, verifyMemberIDs };