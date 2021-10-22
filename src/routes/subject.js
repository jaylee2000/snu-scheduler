const express = require("express");
const router = express.Router({ mergeParams: true });

const { Subject } = require("../models/subject");
const catchAsync = require("../utils/catchAsync.js");

const subject = require("../controllers/subject");
const { isLoggedIn, isOwner } = require("../utils/loginMiddleware");

router
    .route("/")
    .get(isLoggedIn, subject.renderAllSubjects)
    .post(isLoggedIn, subject.checkMaxSubjectCount, subject.parseInput, catchAsync(subject.createNewSubject));

router
    .route("/best")
    .get(isLoggedIn, subject.checkMaxSubjectCount, subject.calculateBestSchedules, subject.displayBestSchedules);

router.route("/new").get(isLoggedIn, subject.checkMaxSubjectCount, subject.renderCreate);

router.route("/update/:id").get(isLoggedIn, isOwner, subject.renderUpdate);

router
    .route("/:id")
	.get(isLoggedIn, isOwner, subject.showSubject)
    .patch(isLoggedIn, isOwner, subject.parseInput, catchAsync(subject.updateSubject))
    .delete(isLoggedIn, isOwner, subject.deleteSubject);

module.exports = router;
