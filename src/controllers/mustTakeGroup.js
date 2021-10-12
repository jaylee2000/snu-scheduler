const { Subject } = require("../models/subject");
const { MustTakeGroup } = require("../models/mustTakeGroup");
const { ExpressError } = require("../utils/ExpressError");
const { validateMustTakeGroup, verifyMemberIDs } = require("../utils/validateJoiSchemas");

module.exports.renderAllMustTakeGroups = async (req, res) => {
    const allGroups = await MustTakeGroup.find({owner: req.user._id}).populate("members");
    res.render("musttakegroup/index.ejs", {
        title: "SNU Scheduler",
        allGroups,
    });
};

module.exports.createNewMustTakeGroup = async (req, res) => {
    const { name, members, minSelection, maxSelection } = req.body;
    const membersIDList = members.split(","); // Spaces not allowed... let's fix this using trim
	const ownerstr = req.user._id.toString();
	validateMustTakeGroup(name, membersIDList, minSelection, maxSelection, ownerstr);
	await verifyMemberIDs(membersIDList);
    const newGroup = new MustTakeGroup({
        name,
		members: membersIDList,
        minSelection,
        maxSelection,
    });
	newGroup.owner = req.user._id;
    await newGroup.save();

    res.redirect("/musttake");
};

module.exports.renderCreate = (req, res) => {
    res.render("musttakegroup/new.ejs", { title: "SNU Scheduler" });
};

module.exports.renderUpdate = async (req, res) => {
    const updateGroup = await MustTakeGroup.findById(req.params.id);
    res.render("musttakegroup/update.ejs", {
        title: "SNU Scheduler",
        updateGroup,
    });
};

module.exports.updateMustTakeGroup = async (req, res) => {
    const { name, members, minSelection, maxSelection } = req.body;
    const membersIDList = members.split(",");
	const ownerstr = req.user._id.toString();
	validateMustTakeGroup(name, membersIDList, minSelection, maxSelection, ownerstr);
	await verifyMemberIDs(membersIDList);
    const updateGroup = await MustTakeGroup.findByIdAndUpdate(req.params.id, {
        name,
        members: membersIDList,
        minSelection,
        maxSelection,
    });
	updateGroup.owner = req.user._id;
    await updateGroup.save();
    res.redirect("/musttake");
};

module.exports.deleteMustTakeGroup = async (req, res) => {
    await MustTakeGroup.findByIdAndDelete(req.params.id);
    res.redirect("/musttake");
};
