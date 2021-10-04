// A typical subject object contains
// {
// 	mon: [n1, n2, n3, n4],
// 	tue: [],
// 	wed: [n5, n6],
// 	thur: [n7, n8],
// 	fri: []
// }

// generateYoilBlocks returns an object
// {
// 	monBlock: [ [n1, n2], [n3, n4] ],
// 	tueBlock: [],
// 	wedBlock: [ [n5, n6]	],
// 	thurBlock: [ [n7, n8] ],
// 	friBlock: []
// }
const { daysOfWeek } = require("../definitions/arrays");

const nullBlock = {
	monBlock: [],
	tueBlock: [],
	wedBlock: [],
	thurBlock: [],
	friBlock: []
}


function generateYoilBlocks(subject) {
    if (!subject)
        return nullBlock;
    else {
		for(let yoil of daysOfWeek) {
			if(subject[yoil[1]] === null) {
				return nullBlock;
			}
			else if(subject[yoil[1]] && subject[yoil[1]].length % 2) {
				// odd length array
				return nullBlock;
			}
		}
		
        const monBlock = [];
		if(subject.mon) {
			for (let i = 0; i < subject.mon.length; i += 2) {
				monBlock.push([subject.mon[i], subject.mon[i + 1]]);
			}
		}
        
        // console.log(monBlock);
        const tueBlock = [];
		if(subject.tue) {
			for (let i = 0; i < subject.tue.length; i += 2) {
				tueBlock.push([subject.tue[i], subject.tue[i + 1]]);
			}
		}
        
        // console.log(tueBlock);
        const wedBlock = [];
		if(subject.wed) {
			for (let i = 0; i < subject.wed.length; i += 2) {
				wedBlock.push([subject.wed[i], subject.wed[i + 1]]);
			}
		}
        
        // console.log(wedBlock);
        const thurBlock = [];
		if(subject.thur) {
			for (let i = 0; i < subject.thur.length; i += 2) {
				thurBlock.push([subject.thur[i], subject.thur[i + 1]]);
			}
		}
        
        // console.log(thurBlock);
        const friBlock = [];
		if(subject.fri) {
			for (let i = 0; i < subject.fri.length; i += 2) {
				friBlock.push([subject.fri[i], subject.fri[i + 1]]);
			}
		}
        
        // console.log(friBlock);
        return { monBlock, tueBlock, wedBlock, thurBlock, friBlock };
    }
}

module.exports = { generateYoilBlocks };
