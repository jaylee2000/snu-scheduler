const mongoose = require("mongoose");
const { Schedule } = require("../database/schedule");


// Takes an array of jobs sorted by 'end time', and index which we must find predecessor of.
function doesConflictExist(sch1, sch2) {
    
}

function max(a, b) {
    return a > b ? a : b;
}

async function calculateMaxIntervalSum() {
    const candidates = await Schedule.find({});
}

module.exports = { calculateMaxIntervalSum };

//https://stackoverflow.com/questions/12152409/find-all-combinations-of-options-in-a-loop