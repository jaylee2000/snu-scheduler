const express = require("express");
const router = express.Router({ mergeParams: true });

const { Subject } = require("../models/subject");
const { MustTakeGroup } = require("../models/mustTakeGroup");

const musttakegroup = require("../controllers/mustTakeGroup");
const catchAsync = require("../utils/catchAsync");

router
    .route("/")
    .get(musttakegroup.renderAllMustTakeGroups)
    .post(catchAsync(musttakegroup.createNewMustTakeGroup));

router.route("/new").get(musttakegroup.renderCreate);

router.route("/update/:id").get(musttakegroup.renderUpdate);

router
    .route("/:id")
    .patch(catchAsync(musttakegroup.updateMustTakeGroup))
    .delete(musttakegroup.deleteMustTakeGroup);

module.exports = router;
