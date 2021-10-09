const express = require("express");
const router = express.Router({ mergeParams: true });

const { Restriction } = require("../models/restriction");
const { daysOfWeek } = require("../definitions/arrays");
const { parseSubjectInput } = require("../functions/parseSubjectInput");
const { generateYoilBlocks } = require("../functions/generateYoilBlocks");
const catchAsync = require("../utils/catchAsync.js");

const restriction = require("../controllers/restriction");

router
    .route("/")
    .get(restriction.renderAllRestrictions)
    .post(catchAsync(restriction.createNewRestriction));

router.route("/new").get(restriction.renderCreate);

router.route("/update/:id").get(restriction.renderUpdate);

router
    .route("/:id")
    .patch(catchAsync(restriction.updateRestriction))
    .delete(restriction.deleteRestriction);

module.exports = router;
