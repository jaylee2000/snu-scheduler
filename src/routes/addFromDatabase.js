const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Subject } = require("../models/subject");
const { ProvidedSubject } = require("../models/providedSubject");
const { validateSubjectExtended } = require("../utils/validateJoiSchemas.js");
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn } = require("../utils/loginMiddleware");

router.route("/")
	.get( async (req, res) => {
		res.render("./database/index.ejs");
	})

router.route("/search")
	.get( async (req, res) => {
		const {name} = req.query;
		const candidates = await ProvidedSubject.find({subjectName: name});
		res.render("./database/searchResult.ejs", {candidates});
	})

router.route("/add/:id")
	.post( isLoggedIn, async (req, res) => {
		const { weight = 1, mustTake = false } = req.body;
		const selectedSubject = await ProvidedSubject.findById(req.params.id);
		if(weight) selectedSubject.weight = weight;
		if(mustTake) selectedSubject.mustTake = mustTake;
	
		// remove _id, __v ?
		
		const saveSubject = new Subject(selectedSubject);
		saveSubject.owner = req.user._id;
		saveSubject._id = mongoose.Types.ObjectId();
		saveSubject.isNew = true;
		await saveSubject.save();
		res.redirect("/");
	})

module.exports = router;