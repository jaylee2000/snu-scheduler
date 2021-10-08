const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Schedule } = require("./subject");

// Typically looks like
// {
// 	name: 'Jeonpil 1',
// 	members: {
// 		[SubjectA, SubjectB, SubjectC]
// 	},
// 	minSelection: {
// 		1
// 	},
// 	maxSelection: {
// 		2
// 	}
// }
// Validation is currently not being done.

const mustTakeGroupSchema = new Schema({
	name: {
	   type: String,
	   required: true
    },
	members: [{
		type: Schema.Types.ObjectId,
		ref: "Subject"
	}],
	minSelection: {
	   type: Number,
	   required: true
	},
	maxSelection: {
	   type: Number,
	   required: true
	}
});


const MustTakeGroup = mongoose.model("MustTakeGroup", mustTakeGroupSchema);

module.exports = { MustTakeGroup };
