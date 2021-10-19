// Newer version of parsing subjects from strings to nested arrays
const { mondayToFriday } = require("../definitions/arrays");
const nullBlock = { mon: [], tue: [], wed: [], thur: [], fri: [] };

function generateIntervals(subject) {
    if (!subject) return nullBlock;
    else {
        for (let day of mondayToFriday) {
            if (subject[day] === null) return nullBlock;
            else if (subject[day] && subject[day].length % 2) return nullBlock; // If an array has odd length; time interval doesn't close
        }
		
		const groupedIntervals = {};
		
		for (let day of mondayToFriday) {
			let interval = [];
			if(subject[day]) {
				for(let i = 0; i < subject[day].length; i += 2) {
					interval.push([subject[day][i], subject[day][i+1]]);
				}
			}
			groupedIntervals[day] = interval;
		}

        return groupedIntervals;
    }
}



function stringToArrays(mon, tue, wed, thur, fri) {
	// convert "2-3, 4-7" --> [2, 3, 4, 7]
	const subjectTimes = {
		mon: mon && mon.length ? mon.match(/([+]?([0-9]+\.?[0-9]*|\.[0-9]+))+/g) : [],
        tue: tue && tue.length ? tue.match(/([+]?([0-9]+\.?[0-9]*|\.[0-9]+))+/g) : [],
        wed: wed && wed.length ? wed.match(/([+]?([0-9]+\.?[0-9]*|\.[0-9]+))+/g) : [],
        thur: thur && thur.length ? thur.match(/([+]?([0-9]+\.?[0-9]*|\.[0-9]+))+/g) : [],
        fri: fri && fri.length ? fri.match(/([+]?([0-9]+\.?[0-9]*|\.[0-9]+))+/g) : []
	}
	
	// convert null --> []
	for(let day of mondayToFriday) {
		if(!subjectTimes[day]) {
			subjectTimes[day] = [];
		}
	}
	
	return subjectTimes;
}


function parseTimeIntervals(mon, tue, wed, thur, fri) {
	const subjectTime = stringToArrays(mon, tue, wed, thur, fri);
	// Input:  "2-3, 4-7", "4-5", "", "", ""
	// Output: { mon: [2, 3, 4, 7], tue: [4, 5], wed: [], thur: [], fri: [] }
	
	const timeIntervals = generateIntervals(subjectTime);
	// Input: { mon: [2, 3, 4, 7], tue: [4, 5], wed: [], thur: [], fri: [] }
	// Output: { mon: [ [2, 3], [4, 7] ], tue: [ [4, 5] ], wed: [], thur: [], fri: [] }
	
	return timeIntervals;
}

module.exports = { parseTimeIntervals, stringToArrays, generateIntervals };