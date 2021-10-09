const {Subject} = require("../models/subject");
const {MustTakeGroup} = require("../models/mustTakeGroup");

module.exports.renderAllMustTakeGroups = async (req, res) => {
	const allGroups = await MustTakeGroup.find({}).populate('members');
	res.render('musttakegroup/index.ejs', {title: 'SNU Scheduler', allGroups});
}

module.exports.createNewMustTakeGroup = async (req, res) => {
	const {name, members, minSelection, maxSelection} = req.body;
	const membersIDList = members.split(','); // VERY Fragile! No validation going on AT ALL!!

	const newGroup = new MustTakeGroup({
		name,
		minSelection,
		maxSelection
	})
	for(let memberID of membersIDList) {
		const subject = await Subject.findById(memberID);
		newGroup.members.push(subject);
	}
	await newGroup.save();

	res.redirect('/musttake');
}

module.exports.renderCreate = (req, res) => {
	res.render('musttakegroup/new.ejs', {title: 'SNU Scheduler'});
}

module.exports.renderUpdate = async (req, res) => {
	const updateGroup = await MustTakeGroup.findById(req.params.id);
	res.render('musttakegroup/update.ejs', {title: 'SNU Scheduler', updateGroup});
}

module.exports.updateMustTakeGroup = async (req, res) => {
	const {name, members, minSelection, maxSelection} = req.body;
	const membersIDList = members.split(',');
	const updateGroup = await MustTakeGroup.findByIdAndUpdate(req.params.id, {
		name,
		members: membersIDList,
		minSelection,
		maxSelection
	});
	await updateGroup.save();
	res.redirect('/musttake');
}

module.exports.deleteMustTakeGroup = async (req, res) => {
	await MustTakeGroup.findByIdAndDelete(req.params.id);
	res.redirect('/musttake');
}