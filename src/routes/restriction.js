const express = require("express");
const router = express.Router({ mergeParams: true });

const { Restriction } = require("../models/restriction");
const catchAsync = require("../utils/catchAsync.js");

const restriction = require("../controllers/restriction");
const { isLoggedIn, isRestrictionOwner } = require("../utils/loginMiddleware");

router
    .route("/")
    .get(isLoggedIn, catchAsync(restriction.renderAllRestrictions))
    .post(isLoggedIn, restriction.parseInput, catchAsync(restriction.createNewRestriction));

router.route("/new").get(isLoggedIn, restriction.renderCreate);

router.route("/update/:id").get(isLoggedIn, catchAsync(isRestrictionOwner), catchAsync(restriction.renderUpdate));

router
    .route("/:id")
    .patch(isLoggedIn, catchAsync(isRestrictionOwner), restriction.parseInput, catchAsync(restriction.updateRestriction))
    .delete(isLoggedIn, catchAsync(isRestrictionOwner), catchAsync(restriction.deleteRestriction));

module.exports = router;
