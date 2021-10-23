const express = require("express");
const router = express.Router({ mergeParams: true });

const { Subject } = require("../models/subject");
const catchAsync = require("../utils/catchAsync.js");

const subject = require("../controllers/subject");
const { isLoggedIn, isOwner } = require("../utils/loginMiddleware");

router
    .route("/")
    .get(isLoggedIn, catchAsync(subject.renderAllSubjects))
    .post(isLoggedIn, catchAsync(subject.checkMaxSubjectCount), subject.parseInput, catchAsync(subject.createNewSubject));

router
    .route("/best")
    .get(isLoggedIn, catchAsync(subject.checkMaxSubjectCount), catchAsync(subject.calculateBestSchedules), subject.displayBestSchedules);

router.route("/new").get(isLoggedIn, catchAsync(subject.checkMaxSubjectCount), subject.renderCreate);

router.route("/update/:id").get(isLoggedIn, catchAsync(isOwner), catchAsync(subject.renderUpdate));

router
    .route("/:id")
	.get(isLoggedIn, catchAsync(isOwner), catchAsync(subject.showSubject))
    .patch(isLoggedIn, catchAsync(isOwner), subject.parseInput, catchAsync(subject.updateSubject))
    .delete(isLoggedIn, catchAsync(isOwner), catchAsync(subject.deleteSubject));

module.exports = router;
