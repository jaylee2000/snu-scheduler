const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Typically looks like
// {
// 	subjectName: 'Math 101',
// 	mon: [ [2, 3], [5, 7], [10, 11] ],
// 	tue: [ [1, 4] ],
// 	wed: [ ],
// 	thur: [ ],
// 	fri: [ ],
// 	weight: 10
// }
// Validation is currently not being done.


const subjectSchema = new Schema({
    subjectName: {
        type: String,
        default: "Unknown",
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
    weight: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = { Subject };
