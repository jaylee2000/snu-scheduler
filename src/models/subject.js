const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { User } = require("./user");

const subjectSchema = new Schema({
	classification: String, 
	college: String, 
	department: String, 
	degree: {
		  type: String,
		  enum: ['박사', '석박사통합', '석사', '학사', '학석사통합']
	},
	grade: String,
	subjectNum: String,
	classNum: String,
    subjectName: {
        type: String,
        default: "Unknown",
    },
    credit: {
        type: Number,
        required: true
    },
	lectureHours: {
		 type: Number
	},
	labHours: {
		 type: Number
	},
    mon: {
        type: [[Number]],
    },
    tue: {
        type: [[Number]],
    },
    wed: {
        type: [[Number]],
    },
    thur: {
        type: [[Number]],
    },
    fri: {
        type: [[Number]],
    },
	formOfClass: String,
	roomNum: String,
	prof: String,
	capacity: Number,
	remark: String,
	language: String,
    weight: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    mustTake: {
        type: Boolean,
        default: false
    },
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});


const Subject = mongoose.model("Subject", subjectSchema);

module.exports = { Subject, subjectSchema };
