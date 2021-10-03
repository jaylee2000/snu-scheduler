const { Restriction } = require("../models/restriction");
const { parseSubjectInput } = require("../functions/parseSubjectInput");
const { generateYoilBlocks } = require("../functions/generateYoilBlocks");
const { daysOfWeek } = require("../definitions/arrays");





module.exports.renderAllRestrictions = async (req, res) => {
	const restrictions = await Restriction.find({});
	console.log(restrictions);
	res.render("./restriction/index", {restrictions, daysOfWeek});
}

module.exports.createNewRestriction = async (req, res) => {
	const {mon, tue, wed, thur, fri} = req.body;
	const blockedTimes = parseSubjectInput(mon, tue, wed, thur, fri);
	const yoilBlocks = generateYoilBlocks(blockedTimes);
	const newRestriction = new Restriction({
		mon: yoilBlocks.monBlock,
		tue: yoilBlocks.tueBlock,
		wed: yoilBlocks.wedBlock,
		thur: yoilBlocks.thurBlock,
		fri: yoilBlocks.friBlock
	});
	await newRestriction.save();
	res.redirect("/restriction");
}

module.exports.renderCreate = (req, res) => {
	res.render("./restriction/new", {daysOfWeek});
}

module.exports.renderUpdate = async (req, res) => {
    const updateRestriction = await Restriction.findById(req.params.id);
    res.render("./restriction/update", { updateRestriction, daysOfWeek });
};

module.exports.updateRestriction = async (req, res) => {
    const { mon, tue, wed, thur, fri } = req.body;
    const blockedTimes = parseSubjectInput(mon, tue, wed, thur, fri);
    const yoilBlocks = generateYoilBlocks(blockedTimes);
    const updateRestriction = await Restriction.findByIdAndUpdate(req.params.id, {
        mon: yoilBlocks.monBlock,
        tue: yoilBlocks.tueBlock,
        wed: yoilBlocks.wedBlock,
        thur: yoilBlocks.thurBlock,
        fri: yoilBlocks.friBlock
    });
    await updateRestriction.save();
    res.redirect("/restriction");
};

// Delete Restriction
module.exports.deleteRestriction = async (req, res) => {
    const removeRestriction = await Restriction.findByIdAndDelete(req.params.id);
    res.redirect("/restriction");
};