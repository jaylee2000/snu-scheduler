const Joi = require('joi');

module.exports.subjectSchema = Joi.object({
	subjectName: Joi.string(),
	mon: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	tue: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	wed: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	thur: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	fri: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	weight: Joi.number().integer().min(1).max(10).required(),
	mustTake: Joi.boolean(),
	credit: Joi.number().integer().min(0).max(10).required()
})

module.exports.restrictionSchema = Joi.object({
	restrictionName: Joi.string().allow(''),
	mon: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	tue: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	wed: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	thur: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
	fri: Joi.array().items(Joi.array().items(Joi.number().integer()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0])
})

module.exports.mustTakeGroupSchema = Joi.object({
	name: Joi.string(),
	members: Joi.array(),
	minSelection: Joi.number().integer().min(0).max(10),
	maxSelection: Joi.number().integer().min(0).max(10)
})

// Using unique: Check that mon, tue, ..., fri... All numbers are in ascending order. (2-1 not allowed. 3-4, 2-3 not allowed. 2-3, 3-4 not allowed.)

// MUST-ADD: minSelection <= maxSelection <= members.length