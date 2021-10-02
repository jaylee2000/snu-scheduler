const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    subjectName: {
        type: String,
        default: "Unknown",
    },
    start: {
        type: Number,
        required: true,
    },
    end: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = { Schedule };
