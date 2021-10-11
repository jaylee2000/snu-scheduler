const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Schedule } = require("./subject");
const { User } = require("./user");

const mustTakeGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "Subject",
        },
    ],
    minSelection: {
        type: Number,
        required: true,
    },
    maxSelection: {
        type: Number,
        required: true,
    },
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

const MustTakeGroup = mongoose.model("MustTakeGroup", mustTakeGroupSchema);

module.exports = { MustTakeGroup };
