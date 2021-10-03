const mongoose = require("mongoose");
const { Schedule } = require("../database/schedule");

function sortByWeight(candidateScheduleA, candidateScheduleB) {
	return -candidateScheduleA.sum +candidateScheduleB.sum
}


function getWeightSum(selectedClasses) {
	let sum = 0;
	for(let i = 0; i < selectedClasses.length; i++) {
		sum += selectedClasses[i].weight;
	}
	return sum;
}

function isPossibleCombination(selectedClasses) {
	const yoils = ['mon', 'tue', 'wed', 'thur', 'fri'];
	for(let i = 0; i < selectedClasses.length; i++) {
		for(let j = i+1; j < selectedClasses.length; j++) {
			for(let k = 0; k < yoils.length; k++) {
				let s1 = selectedClasses[i][yoils[k]].start;
				let s2 = selectedClasses[i][yoils[k]].end;
				let e1 = selectedClasses[j][yoils[k]].start;
				let e2 = selectedClasses[j][yoils[k]].end;
				if(s1 > 0 && s2 > 0) {	// both subjects run on this yoil
					if(e1 > s2 || e2 > s1) { // overlap
						return false;
					}
				}
			}
		}
	}
	return true;
}

function schedulize(possibleClasses, selectedIndices) {
	const selectedClasses = [];
	for(let i = 0; i < selectedIndices.length; i++) {
		if(selectedIndices[i]) {
			selectedClasses.push(possibleClasses[i]);
		}
	}
	if(isPossibleCombination(selectedClasses)) {
		const sum = getWeightSum(selectedClasses);
		return {selectedClasses, sum};
	}
	else {
		return undefined
	}
}


// https://stackoverflow.com/questions/12152409/find-all-combinations-of-options-in-a-loop
const cartesian =
  (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));


async function calculateMaxIntervalSum() {
    const candidates = await Schedule.find({});
	
	// generate [ [0, 0, 0, 0, 0, ..., 0], [0, 0, 0, 0, 0, ..., 1] ... [1, 1, 1, 1, 1, ..., 1] ]
	const cartesianSeed = [];
	for(let i = 0; i < candidates.length; i++) {
		cartesianSeed.push([0, 1]);
	}
	const possibleCombinations = cartesian(...cartesianSeed);
	// console.log('possibleCombinations', possibleCombinations);
	
	const possibleSchedules = [];
	for(let i = 1; i < possibleCombinations.length; i++) {
		const candidateSchedule = schedulize(candidates, possibleCombinations[i]);
		if(candidateSchedule) {
			possibleSchedules.push(candidateSchedule);
		}
	}
	
	// sort possibleSchedules by weight sum (in descending order)
	possibleSchedules.sort(sortByWeight);

	
	// console.log('possibleSchedules', possibleSchedules[0].selectedClasses, possibleSchedules[1].selectedClasses);
	console.log('possibleSchedules', possibleSchedules);
	
	return possibleSchedules;
}

module.exports = { calculateMaxIntervalSum };