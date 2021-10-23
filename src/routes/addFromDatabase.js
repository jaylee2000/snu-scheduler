const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Subject } = require("../models/subject");
const { ProvidedSubject } = require("../models/providedSubject");
const { validateSubjectExtended } = require("../utils/validateJoiSchemas.js");
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn } = require("../utils/loginMiddleware");

const subject = require("../controllers/subject");

router.route("/")
	.get(isLoggedIn, catchAsync(subject.checkMaxSubjectCount), subject.renderAddFromDatabase);

router.route("/search")
	.get(isLoggedIn, catchAsync(subject.checkMaxSubjectCount), catchAsync(subject.renderDatabaseSearchResults));

router.route("/add/:id")
	.post(isLoggedIn, catchAsync(subject.checkMaxSubjectCount), catchAsync(subject.addSubjectFromDatabase));

module.exports = router;