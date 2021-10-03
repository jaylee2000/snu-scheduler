const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Typically looks like
// {
// 	mon: [ [2, 3], [5, 7], [10, 11] ],
// 	tue: [ [1, 4] ],
// 	wed: [ ],
// 	thur: [ ],
// 	fri: [ ]
// }
// Validation is currently not being done.

const restrictionSchema = new Schema({
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
    }
});

const Restriction = mongoose.model("Restriction", restrictionSchema);

module.exports = { Restriction };
