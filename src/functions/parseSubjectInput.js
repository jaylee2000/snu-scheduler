// Refer to README.me for a lenghty explanation.
// Parameters mon, tue, ..., fri are initially all strings.
// If mon = "2-3, 5/7, 14 18", tue="", wed="", thur="", fri="2-3"
// return object looks like:
// {
// 	mon: [2, 3, 5, 7, 14, 18],
// 	tue: [],
// 	wed: [],
// 	thur: [],
// 	fri: [2, 3]
// }

const { daysOfWeek } = require("../definitions/arrays");

function parseSubjectInput(mon, tue, wed, thur, fri) {
    return {
        mon: mon && mon.length ? mon.match(/\d+/g) : [],
        tue: tue && tue.length ? tue.match(/\d+/g) : [],
        wed: wed && wed.length ? wed.match(/\d+/g) : [],
        thur: thur && thur.length ? thur.match(/\d+/g) : [],
        fri: fri && fri.length ? fri.match(/\d+/g) : [],
    };
}

module.exports = { parseSubjectInput };
