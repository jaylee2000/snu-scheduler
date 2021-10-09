const { Subject } = require("../models/subject");
const { MustTakeGroup } = require("../models/mustTakeGroup");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

module.exports.renderAllMustTakeGroups = catchAsync(async (req, res) => {
    const allGroups = await MustTakeGroup.find({}).populate("members");
    res.render("musttakegroup/index.ejs", {
        title: "SNU Scheduler",
        allGroups,
    });
});

module.exports.createNewMustTakeGroup = catchAsync(async (req, res) => {
    const { name, members, minSelection, maxSelection } = req.body;
    const membersIDList = members.split(","); // VERY Fragile! No validation going on AT ALL!!

    const newGroup = new MustTakeGroup({
        name,
        minSelection,
        maxSelection,
    });
    for (let memberID of membersIDList) {
        const subject = await Subject.findById(memberID);
        newGroup.members.push(subject);
    }
    await newGroup.save();

    res.redirect("/musttake");
});

module.exports.renderCreate = (req, res) => {
    res.render("musttakegroup/new.ejs", { title: "SNU Scheduler" });
};

module.exports.renderUpdate = catchAsync(async (req, res) => {
    const updateGroup = await MustTakeGroup.findById(req.params.id);
    res.render("musttakegroup/update.ejs", {
        title: "SNU Scheduler",
        updateGroup,
    });
});

module.exports.updateMustTakeGroup = catchAsync(async (req, res) => {
    const { name, members, minSelection, maxSelection } = req.body;
    const membersIDList = members.split(",");
    const updateGroup = await MustTakeGroup.findByIdAndUpdate(req.params.id, {
        name,
        members: membersIDList,
        minSelection,
        maxSelection,
    });
    await updateGroup.save();
    res.redirect("/musttake");
});

module.exports.deleteMustTakeGroup = catchAsync(async (req, res) => {
    await MustTakeGroup.findByIdAndDelete(req.params.id);
    res.redirect("/musttake");
});
