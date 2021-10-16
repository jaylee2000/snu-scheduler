const Joi = require('joi');

// owner should match regex
// ObjectID("
// length-24-alphanumeric-string
// ")



module.exports.subjectSchema = Joi.object({
	subjectName: Joi.string(),
	mon: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	tue: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	wed: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	thur: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	fri: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	weight: Joi.number().integer().min(1).max(10).required(),
	mustTake: Joi.boolean(),
	credit: Joi.number().integer().min(0).max(10).required(),
	roomNum: Joi.string().allow(''),
	remark: Joi.string().allow(''),
	ownerstr: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24}$'))
})

module.exports.subjectSchemaExtended = Joi.object({
	subjectName: Joi.string(),
	mon: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	tue: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	wed: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	thur: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	fri: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	weight: Joi.number().integer().min(1).max(10).required(),
	mustTake: Joi.boolean(),
	credit: Joi.number().integer().min(0).max(10).required(),
	roomNum: Joi.string().allow(''),
	remark: Joi.string().allow(''),
	ownerstr: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24}$')),
	
	classification: Joi.string().required(),
	college : Joi.string().allow(''),
	department : Joi.string().allow(''),
	degree: Joi.string().allow(''), // required for seeds only
	grade: Joi.string().allow(''),
	subjectNum : Joi.string().allow(''),
	classNum: Joi.string().allow(''),
	lectureHours: Joi.number().allow(''), // required for seeds only
	labHours: Joi.number().allow(''), // required for seeds only
	formOfClass : Joi.string().allow(''),
	roomNum : Joi.string().allow(''),
	prof: Joi.string().allow(''),
	capacity: Joi.number().allow(''),
	remark: Joi.string().allow(''),
	language : Joi.string().allow('')
})

module.exports.restrictionSchema = Joi.object({
	restrictionName: Joi.string().allow(''),
	mon: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	tue: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	wed: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	thur: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	fri: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	ownerstr: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24}$'))
})

module.exports.mustTakeGroupSchema = Joi.object({
	name: Joi.string(),
	members: Joi.array().unique((a, b) => a === b),
	minSelection: Joi.number().integer().min(0).max(10),
	maxSelection: Joi.number().integer().min(0).max(10),
	ownerstr: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{24}$'))
}).custom( (value, helper) => {
	if(value.minSelection > value.maxSelection) {
		return helper.message('minSelection cannot be larger than maxSelection');
	} else if(value.maxSelection > value.members.length) {
		return helper.message('maxSelection cannot be larger than number of members');
	} else {
		return true;
	}
})

// Using unique: Check that mon, tue, ..., fri... All numbers are in ascending order. (2-1 not allowed. 3-4, 2-3 not allowed. 2-3, 3-4 not allowed.)

// MUST-ADD: minSelection <= maxSelection <= members.length