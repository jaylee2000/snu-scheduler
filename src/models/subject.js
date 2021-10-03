const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    subjectName: {
        type: String,
        default: "Unknown",
    },
    mon: {
		type: [[Number]]
    },
    tue: {
        type: [[Number]]
    },
    wed: {
        type: [[Number]]
    },
    thur: {
        type: [[Number]]
    },
    fri: {
        type: [[Number]]
    },
    weight: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = { Subject };
