const express = require("express");
const router = express.Router({ mergeParams: true });

const { Subject } = require("../models/subject");
const { MustTakeGroup } = require("../models/mustTakeGroup");

const musttakegroup = require("../controllers/mustTakeGroup");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isMustTakeGroupOwner } = require("../utils/loginMiddleware");

router
    .route("/")
    .get(isLoggedIn, catchAsync(musttakegroup.renderAllMustTakeGroups))
    .post(isLoggedIn, catchAsync(musttakegroup.createNewMustTakeGroup));

router.route("/new").get(isLoggedIn, catchAsync(musttakegroup.renderCreate));

router.route("/update/:id").get(isLoggedIn, catchAsync(isMustTakeGroupOwner), catchAsync(musttakegroup.renderUpdate));

router
    .route("/:id")
    .patch(isLoggedIn, catchAsync(isMustTakeGroupOwner), catchAsync(musttakegroup.updateMustTakeGroup))
    .delete(isLoggedIn, catchAsync(isMustTakeGroupOwner), catchAsync(musttakegroup.deleteMustTakeGroup));

module.exports = router;
