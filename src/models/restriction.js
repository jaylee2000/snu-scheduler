const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { User } = require("./user");

const restrictionSchema = new Schema({
    restrictionName: {
        type: String,
        required: false,
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
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

const Restriction = mongoose.model("Restriction", restrictionSchema);

module.exports = { Restriction };
