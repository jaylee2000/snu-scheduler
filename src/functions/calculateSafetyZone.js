const { Restriction } = require("../models/restriction");
const { daysOfWeek } = require("../definitions/arrays");
const minTime = 0;
const maxTime = 24;
// let safetyZone = calculateSafetyZone();

function sortByStartTime(a, b) {
	return a[0] - b[0];
}

function max(a, b) {
	return a > b ? a : b;
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
		
		if(minTime < dayBlock[0][0]) {
			safe.push([minTime, dayBlock[0][0]]);
		}
		let currentTaskIndex = 0;
		let currentTime = dayBlock[currentTaskIndex][1];
		while(currentTaskIndex < dayBlock.length - 1) {
			if(currentTime < dayBlock[currentTaskIndex+1][0]) {
				safe.push([currentTime, dayBlock[currentTaskIndex+1][0]]);
			}
			currentTaskIndex++;
			currentTime = max(currentTime, dayBlock[currentTaskIndex][1]);
		}
		if(currentTime < maxTime) {
			safe.push([currentTime, maxTime]);
		}
		safetyZone.push(safe);
	}
	return safetyZone;	// contains safe_mon, safe_tue, ..., safe_fri in order.
}

module.exports = { calculateSafetyZone, minTime, maxTime };