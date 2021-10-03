const { Restriction } = require("../models/restriction");
const { daysOfWeek } = require("../definitions/arrays");
const minTime = 0;
const maxTime = 24;
// let safetyZone = calculateSafetyZone();

function sortByStartTime(a, b) {
	return a[0] - b[0];
}


async function calculateSafetyZone() {
	const safetyZone = [];
	const allRestrictions = await Restriction.find({});
	for(let yoil of daysOfWeek) {
		const dayBlock = []
		for(let restriction of allRestrictions) {
			for(let i = 0; i < restriction[yoil[1]].length; i++) {
				dayBlock.push(restriction[yoil[1]][i]);
			}
		}
		
		if(!dayBlock.length) {
			let safe = [];
			safe.push([minTime, maxTime]);
			safetyZone.push(safe);
			continue;
		}
		
		dayBlock.sort(sortByStartTime);
		let safe = [];
		safe.push([minTime, dayBlock[0][0]]);
		let currentTaskIndex = 0;
		let currentTime = dayBlock[currentTaskIndex][0];
		while(currentTaskIndex < dayBlock.length - 1) {
			if(dayBlock[currentTaskIndex][1] < dayBlock[currentTaskIndex+1][0]) {
				safe.push([dayBlock[currentTaskIndex][1], dayBlock[currentTaskIndex+1][0]]);
			}
			currentTaskIndex += 1;
			currentTime = dayBlock[currentTaskIndex][0];
		}
		safe.push([dayBlock[dayBlock.length - 1][1], maxTime]);
		safetyZone.push(safe);
	}
	return safetyZone;	// contains safe_mon, safe_tue, ..., safe_fri in order.
}

module.exports = { calculateSafetyZone };