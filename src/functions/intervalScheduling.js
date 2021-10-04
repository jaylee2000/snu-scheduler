const mongoose = require("mongoose");
const { Subject } = require("../models/subject");
const { Restriction } = require("../models/restriction");
const { daysOfWeek } = require("../definitions/arrays");
const { calculateSafetyZone } = require("./calculateSafetyZone");

function sortByWeight(candidateScheduleA, candidateScheduleB) {
    return -candidateScheduleA.sum + candidateScheduleB.sum;
}

function getWeightSum(selectedClasses) {
    let sum = 0;
    for (let i = 0; i < selectedClasses.length; i++) {
        sum += selectedClasses[i].weight;
    }
    return sum;
}

function isPossibleCombination(selectedClasses) {
    const yoils = ["mon", "tue", "wed", "thur", "fri"];
    for (let i = 0; i < selectedClasses.length; i++) {
        for (let j = i + 1; j < selectedClasses.length; j++) {
            for (let k = 0; k < yoils.length; k++) {
                for (
                    let blk_i = 0;
                    blk_i < selectedClasses[i][yoils[k]].length;
                    blk_i++
                ) {
                    for (
                        let blk_j = 0;
                        blk_j < selectedClasses[j][yoils[k]].length;
                        blk_j++
                    ) {
                        let s1 = selectedClasses[i][yoils[k]][blk_i][0];
                        let e1 = selectedClasses[i][yoils[k]][blk_i][1];
                        let s2 = selectedClasses[j][yoils[k]][blk_j][0];
                        let e2 = selectedClasses[j][yoils[k]][blk_j][1];
                        if (s1 > 0 && s2 > 0) {
                            // both subjects run on this yoil. We should be able to get rid of this condition.
                            if (e1 > s2 && e2 > s1) {
                                // overlap
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}

function schedulize(possibleClasses, selectedIndices) {
    const selectedClasses = [];
    for (let i = 0; i < selectedIndices.length; i++) {
        if (selectedIndices[i]) {
            selectedClasses.push(possibleClasses[i]);
        }
    }
    if (isPossibleCombination(selectedClasses)) {
        const sum = getWeightSum(selectedClasses);
        return { selectedClasses, sum };
    } else {
        return undefined;
    }
}

function doesOneBlockFitIn(oneTimeBlock, safeTimeBlocks) {
	const start = oneTimeBlock[0];
	const end = oneTimeBlock[1];
	for(let block of safeTimeBlocks) {
		if(block[0] <= start && end <= block[1]) {
			return true;
		}
	}
	return false;
}

function doesFit(subject, safetyZone) {
	for(let i = 0; i < daysOfWeek.length; i++) {
		const subjectTimeBlocks = subject[daysOfWeek[i][1]];
		const safeTimeBlocks = safetyZone[i];
		for(let j = 0; j < subjectTimeBlocks.length; j++) {
			if (!doesOneBlockFitIn(subjectTimeBlocks[j], safeTimeBlocks)) {
				return false;
			}
		}
	}
	return true;
}

// https://stackoverflow.com/questions/12152409/find-all-combinations-of-options-in-a-loop
const cartesian = (...a) =>
    a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

async function calculateMaxIntervalSum() {
    const candidates = await Subject.find({});
	const safetyZone = await calculateSafetyZone();
	
    if (!candidates || !candidates.length) {
        return [];
    }

    // generate [ [0, 0, 0, 0, 0, ..., 0], [0, 0, 0, 0, 0, ..., 1] ... [1, 1, 1, 1, 1, ..., 1] ]
    const cartesianSeed = [];
    for (let i = 0; i < candidates.length; i++) {
		if(candidates[i].mustTake) {
			if(!doesFit(candidates[i], safetyZone)) {
				return []; // Impossible! A mustTake lecture conflicts with restriction.
			}
			cartesianSeed.push([1]);
		}
		else if(!doesFit(candidates[i], safetyZone)) {
			cartesianSeed.push([0]);
		}
        else {
			cartesianSeed.push([0, 1]);
		}
    }
    const possibleCombinations = cartesian(...cartesianSeed);

    const possibleSchedules = [];
    for (let i = 1; i < possibleCombinations.length; i++) {
        const candidateSchedule = schedulize(
            candidates,
            possibleCombinations[i]
        );
        if (candidateSchedule) {
            possibleSchedules.push(candidateSchedule);
        }
    }

    // sort possibleSchedules by weight sum (in descending order)
    possibleSchedules.sort(sortByWeight);

    return possibleSchedules;
}

module.exports = { calculateMaxIntervalSum, isPossibleCombination, schedulize, doesFit };
