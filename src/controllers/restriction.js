const { Restriction } = require("../models/restriction");
const { parseSubjectInput } = require("../functions/parseSubjectInput");
const { generateYoilBlocks } = require("../functions/generateYoilBlocks");
const { daysOfWeek } = require("../definitions/arrays");
const {
    convertNullToEmptyArray,
} = require("../functions/convertNullToEmptyArray_Yoil");
const { validateRestriction } = require("../utils/validateJoiSchemas");

module.exports.renderAllRestrictions = async (req, res) => {
    const restrictions = await Restriction.find({owner: req.user._id});
    res.render("./restriction/index", { restrictions, daysOfWeek });
};

module.exports.createNewRestriction = async (req, res) => {
    const { restrictionName, mon, tue, wed, thur, fri } = req.body;
    const blockedTimes = parseSubjectInput(mon, tue, wed, thur, fri);
    convertNullToEmptyArray(blockedTimes);
    const yoilBlocks = generateYoilBlocks(blockedTimes);
	validateRestriction(restrictionName, yoilBlocks.monBlock, yoilBlocks.tueBlock, yoilBlocks.wedBlock, yoilBlocks.thurBlock, yoilBlocks.friBlock);
    if (restrictionName) {
        const newRestriction = new Restriction({
            restrictionName,
            mon: yoilBlocks.monBlock,
            tue: yoilBlocks.tueBlock,
            wed: yoilBlocks.wedBlock,
            thur: yoilBlocks.thurBlock,
            fri: yoilBlocks.friBlock,
        });
		newRestriction.owner = req.user._id;
        await newRestriction.save();
    } else {
        const newRestriction = new Restriction({
            mon: yoilBlocks.monBlock,
            tue: yoilBlocks.tueBlock,
            wed: yoilBlocks.wedBlock,
            thur: yoilBlocks.thurBlock,
            fri: yoilBlocks.friBlock,
        });
		newRestriction.owner = req.user._id;
        await newRestriction.save();
    }
    res.redirect("/restriction");
};

module.exports.renderCreate = (req, res) => {
    res.render("./restriction/new", { daysOfWeek });
};

module.exports.renderUpdate = async (req, res) => {
    const updateRestriction = await Restriction.findById(req.params.id);
    res.render("./restriction/update", { updateRestriction, daysOfWeek });
};

module.exports.updateRestriction = async (req, res) => {
    const { restrictionName, mon, tue, wed, thur, fri } = req.body;
    const blockedTimes = parseSubjectInput(mon, tue, wed, thur, fri);
    convertNullToEmptyArray(blockedTimes);
    const yoilBlocks = generateYoilBlocks(blockedTimes);
	validateRestriction(restrictionName, yoilBlocks.monBlock, yoilBlocks.tueBlock, yoilBlocks.wedBlock, yoilBlocks.thurBlock, yoilBlocks.friBlock);
    if (restrictionName) {
        const updateRestriction = await Restriction.findByIdAndUpdate(
            req.params.id,
            {
                restrictionName,
                mon: yoilBlocks.monBlock,
                tue: yoilBlocks.tueBlock,
                wed: yoilBlocks.wedBlock,
                thur: yoilBlocks.thurBlock,
                fri: yoilBlocks.friBlock,
            }
        );
		updateRestriction.owner = req.user._id;
        await updateRestriction.save();
    } else {
        const updateRestriction = await Restriction.findByIdAndUpdate(
            req.params.id,
            {
                mon: yoilBlocks.monBlock,
                tue: yoilBlocks.tueBlock,
                wed: yoilBlocks.wedBlock,
                thur: yoilBlocks.thurBlock,
                fri: yoilBlocks.friBlock,
            }
        );
		updateRestriction.owner = req.user._id;
        await updateRestriction.save();
    }
    res.redirect("/restriction");
};

// Delete Restriction
module.exports.deleteRestriction = async (req, res) => {
    const removeRestriction = await Restriction.findByIdAndDelete(
        req.params.id
    );
    res.redirect("/restriction");
};
