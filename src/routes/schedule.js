const express = require("express");
const router = express.Router({ mergeParams: true });

const { Subject } = require("../models/subject");
const { validateSubject } = require("../utils/validateJoiSchemas.js");
const catchAsync = require("../utils/catchAsync.js");

const schedule = require("../controllers/schedule");
const { isLoggedIn, isOwner } = require("../utils/loginMiddleware");

router
    .route("/")
    .get(isLoggedIn, schedule.renderAllSubjects)
    .post(isLoggedIn, catchAsync(schedule.createNewSubject));

router
    .route("/best")
    .get(isLoggedIn, schedule.calculateBestSchedules, schedule.displayBestSchedules);

router.route("/new").get(isLoggedIn, schedule.renderCreate);

router.route("/update/:id").get(isLoggedIn, isOwner, schedule.renderUpdate);

router
    .route("/:id")
    .patch(isLoggedIn, isOwner, catchAsync(schedule.updateSubject))
    .delete(isLoggedIn, isOwner, schedule.deleteSubject);

module.exports = router;
