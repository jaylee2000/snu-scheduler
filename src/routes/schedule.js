const express = require("express");
const router = express.Router({ mergeParams: true });

const { Subject } = require("../models/subject");

const schedule = require("../controllers/schedule");

router
    .route("/")
    .get(schedule.renderAllSubjects)
    .post(schedule.createNewSubject);

router
    .route("/best")
    .get(schedule.calculateBestSchedules, schedule.displayBestSchedules);

router.route("/new").get(schedule.renderCreate);

router.route("/update/:id").get(schedule.renderUpdate);

router
    .route("/:id")
    .patch(schedule.updateSubject)
    .delete(schedule.deleteSubject);

module.exports = router;
