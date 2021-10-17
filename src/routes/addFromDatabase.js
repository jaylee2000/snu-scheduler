const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Subject } = require("../models/subject");
const { ProvidedSubject } = require("../models/providedSubject");
const { validateSubjectExtended } = require("../utils/validateJoiSchemas.js");
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn } = require("../utils/loginMiddleware");

const schedule = require("../controllers/schedule");

router.route("/")
	.get(isLoggedIn, schedule.checkMaxSubjectCount, schedule.renderAddFromDatabase);

router.route("/search")
	.get(isLoggedIn, schedule.checkMaxSubjectCount, schedule.renderDatabaseSearchResults);

router.route("/add/:id")
	.post(isLoggedIn, schedule.checkMaxSubjectCount, schedule.addSubjectFromDatabase);

module.exports = router;