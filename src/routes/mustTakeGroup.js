const express = require("express");
const router = express.Router({ mergeParams: true });

const { Subject } = require("../models/subject");
const { MustTakeGroup } = require("../models/mustTakeGroup");

const musttakegroup = require("../controllers/mustTakeGroup");

router
    .route("/")
    .get(musttakegroup.renderAllMustTakeGroups)
    .post(musttakegroup.createNewMustTakeGroup);

router.route("/new").get(musttakegroup.renderCreate);

router.route("/update/:id").get(musttakegroup.renderUpdate);

router
    .route("/:id")
    .patch(musttakegroup.updateMustTakeGroup)
    .delete(musttakegroup.deleteMustTakeGroup);

module.exports = router;
