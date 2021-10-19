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
	
	req.flash('success', 'Created new group!');
    res.redirect("/musttake");
};

module.exports.renderCreate = async (req, res) => {
	const mySubjects = await Subject.find( { owner: req.user._id } );
    res.render("musttakegroup/new.ejs", { title, mySubjects, daysOfWeek });
};

module.exports.renderUpdate = async (req, res) => {
	const mySubjects = await Subject.find( { owner: req.user._id } );
    const updateGroup = await MustTakeGroup.findById(req.params.id).populate('members');
	
	const checkedSubjects = updateGroup.members;
	
	const nonCheckedSubjects = mySubjects.filter((mySubject) => {
		for(let selectedSubject of updateGroup.members) {
			if(selectedSubject._id.toString() === mySubject._id.toString()) {
				return false;
			}
		}
		return true;
	})
	
    res.render("musttakegroup/update.ejs", { title, updateGroup, checkedSubjects, nonCheckedSubjects, daysOfWeek });
};

module.exports.updateMustTakeGroup = async (req, res) => {
	req.body.ownerstr = req.user._id.toString();

	validateMustTakeGroup(req.body);
	await verifyMemberIDs(req.body.members);
	
	req.body.owner = req.user._id;
	
    const updateGroup = await MustTakeGroup.findByIdAndUpdate(req.params.id, req.body);
    await updateGroup.save();
	
	req.flash('success', 'Updated group!');
    res.redirect("/musttake");
};

module.exports.deleteMustTakeGroup = async (req, res) => {
    await MustTakeGroup.findByIdAndDelete(req.params.id);
	req.flash('success', 'Deleted group!');
    res.redirect("/musttake");
};
