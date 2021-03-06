const { Restriction } = require("../models/restriction");
const { daysOfWeek, mondayToFriday } = require("../definitions/arrays");
const { parseTimeIntervals } = require("../functions/parseTimeIntervals.js");
const { validateRestriction } = require("../utils/validateJoiSchemas");

// Read Restrictions
module.exports.renderAllRestrictions = async (req, res) => {
    const restrictions = await Restriction.find({owner: req.user._id});
    res.render("./restriction/index", { restrictions, daysOfWeek });
};

// Create Restriction
module.exports.parseInput = (req, res, next) => {
	const { mon, tue, wed, thur, fri } = req.body;
	
	const timeIntervals = parseTimeIntervals(mon, tue, wed, thur, fri);
	
	for(let day of mondayToFriday) {
		req.body[day] = timeIntervals[day];
	}
	
	next();
}
module.exports.createNewRestriction = async (req, res) => {
	req.body.ownerstr = req.user._id.toString();
	
	validateRestriction(req.body);
	
	const newRestriction = new Restriction(req.body);
	newRestriction.owner = req.user._id;
	await newRestriction.save();
    
	req.flash('success', 'Added new restriction!');
    res.redirect("/restriction");
};
module.exports.renderCreate = (req, res) => {
    res.render("./restriction/new", { daysOfWeek });
};

// Update Restriction
module.exports.renderUpdate = async (req, res) => {
    const updateRestriction = await Restriction.findById(req.params.id);
    res.render("./restriction/update", { updateRestriction, daysOfWeek });
};
module.exports.updateRestriction = async (req, res) => {
	req.body.ownerstr = req.user._id.toString();
	validateRestriction(req.body);
	
	req.body.owner = req.user._id;
	await Restriction.findByIdAndUpdate(req.params.id, req.body);
	
	req.flash('success', 'Updated restriction!');
    res.redirect("/restriction");
};

// Delete Restriction
module.exports.deleteRestriction = async (req, res) => {
    const removeRestriction = await Restriction.findByIdAndDelete(
        req.params.id
    );
	req.flash('success', 'Deleted restriction!');
    res.redirect("/restriction");
};
