const express = require("express");
const router = express.Router({ mergeParams: true });

const { Restriction } = require("../models/restriction");
const { daysOfWeek } = require("../definitions/arrays");
const { parseSubjectInput } = require("../functions/parseSubjectInput");
const { generateYoilBlocks } = require("../functions/generateYoilBlocks");
const catchAsync = require("../utils/catchAsync.js");

const restriction = require("../controllers/restriction");
const { isLoggedIn, isRestrictionOwner } = require("../utils/loginMiddleware");

router
    .route("/")
    .get(isLoggedIn, restriction.renderAllRestrictions)
    .post(isLoggedIn, restriction.parseInput, catchAsync(restriction.createNewRestriction));

router.route("/new").get(isLoggedIn, restriction.renderCreate);

router.route("/update/:id").get(isLoggedIn, isRestrictionOwner, restriction.renderUpdate);

router
    .route("/:id")
    .patch(isLoggedIn, isRestrictionOwner, restriction.parseInput, catchAsync(restriction.updateRestriction))
    .delete(isLoggedIn, isRestrictionOwner, restriction.deleteRestriction);

module.exports = router;
