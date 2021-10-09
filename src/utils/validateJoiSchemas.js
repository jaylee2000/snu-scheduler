const Joi = require('joi');
const { subjectSchema } = require("./joiSchema.js");
const { ExpressError } = require("./ExpressError.js");

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

module.exports = { validateSubject };