const { Subject } = require("../models/subject");
const { MustTakeGroup } = require("../models/mustTakeGroup");
const { ExpressError } = require("../utils/ExpressError");
const { daysOfWeek } = require("../definitions/arrays");
const { title } = require("../definitions/strings");
const { validateMustTakeGroup, verifyMemberIDs } = require("../utils/validateJoiSchemas");

module.exports.renderAllMustTakeGroups = async (req, res) => {
    const allGroups = await MustTakeGroup.find({owner: req.user._id}).populate("members");
    res.render("musttakegroup/index.ejs", { title, allGroups });
};

module.exports.createNewMustTakeGroup = async (req, res) => {
	req.body.ownerstr = req.user._id.toString();
	
	validateMustTakeGroup(req.body);
	await verifyMemberIDs(req.body.members);
	
    const newGroup = new MustTakeGroup(req.body);
	newGroup.owner = req.user._id;
    await newGroup.save();

    res.redirect("/musttake");
};

module.exports.renderCreate = async (req, res) => {
	const mySubjects = await Subject.find( { owner: req.user._id } );
    res.render("musttakegroup/new.ejs", { title, mySubjects, daysOfWeek });
};

module.exports.renderUpdate = async (req, res) => {
	const mySubjects = await Subject.find( { owner: req.user._id } );
    const updateGroup = await MustTakeGroup.findById(req.params.id);
    res.render("musttakegroup/update.ejs", { title, mySubjects, updateGroup, daysOfWeek });
};

module.exports.updateMustTakeGroup = async (req, res) => {
	req.body.ownerstr = req.user._id.toString();

	validateMustTakeGroup(req.body);
	await verifyMemberIDs(req.body.members);
	
	req.body.owner = req.user._id;
	
    const updateGroup = await MustTakeGroup.findByIdAndUpdate(req.params.id, req.body);
    await updateGroup.save();
	
    res.redirect("/musttake");
};

module.exports.deleteMustTakeGroup = async (req, res) => {
    await MustTakeGroup.findByIdAndDelete(req.params.id);
    res.redirect("/musttake");
};
