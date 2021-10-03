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

function parseSubjectInput(mon, tue, wed, thur, fri) {
    return {
        mon: mon.match(/\d+/g) || [],
        tue: tue.match(/\d+/g) || [],
        wed: wed.match(/\d+/g) || [],
        thur: thur.match(/\d+/g) || [],
        fri: fri.match(/\d+/g) || [],
    };
}

module.exports = { parseSubjectInput };
