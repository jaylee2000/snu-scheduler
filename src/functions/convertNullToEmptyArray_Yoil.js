// To be deprecated


const { daysOfWeek } = require("../definitions/arrays");

function convertNullToEmptyArray(subject) {
    for (let yoil of daysOfWeek) {
        // change null --> []
        if (!subject[yoil[1]]) {
            subject[yoil[1]] = [];
        }
    }
}

module.exports = { convertNullToEmptyArray };
