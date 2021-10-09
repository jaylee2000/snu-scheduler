const request = require('supertest');
const app = require('../src/app');

const { Subject } = require("../src/models/subject.js");
const { Restriction } = require("../src/models/restriction.js");

const { parseSubjectInput } = require("../src/functions/parseSubjectInput");
const { generateYoilBlocks } = require("../src/functions/generateYoilBlocks");
const { convertNullToEmptyArray } = require("../src/functions/convertNullToEmptyArray_Yoil");
const { calculateSafetyZone, minTime, maxTime } = require("../src/functions/calculateSafetyZone");
const { calculateMaxIntervalSum, isPossibleCombination, schedulize, doesFit } = require("../src/functions/intervalScheduling");

beforeEach( async () => {
	await Restriction.deleteMany({});
	await Subject.deleteMany({});
})

afterEach( async () => {
	await Restriction.deleteMany({});
	await Subject.deleteMany({});
})

test('parseSubjectInput', () => {
	const mon = "     ", tue = "234-23452345-23423", wed="14;-134;-43..23.4", thur="1&#$@%-1", fri = undefined;
	const subject = parseSubjectInput(mon, tue, wed, thur, fri);
	expect(subject.mon).toBeNull();
	expect(subject.tue).toEqual(["234", "23452345", "23423"]);
	expect(subject.wed).toEqual(["14", "134" , "43" , "23" , "4" ]); // negative numbers unallowed
	expect(subject.thur).toEqual(["1", "1"]); // negative numbers unallowed
	expect(subject.fri).toEqual([]);
})

test('generateYoilBlocks', () => {
	const oddLengthInput = {
		mon: ['1', '4', '5'],
		tue: ['4', '7'],
		wed: [],
		thur: [],
		fri: []
	}
	
	const nullInput = {
		mon: null,
		tue: undefined,
		thur: ['3', '4']
	}
	
	const goodInput = {
		mon: ['3', '4'],
		thur: ['firstNum', 'secondNum', 'thirdNum', 'fourthNum'],
		fri: ['1', '11', '4', '23']
	}
	
	const nullResponse = {
		monBlock: [],
		tueBlock: [],
		wedBlock: [],
		thurBlock: [],
		friBlock: []
	}
	
	const goodResponse = {
		monBlock: [['3', '4']],
		tueBlock: [],
		wedBlock: [],
		thurBlock: [['firstNum', 'secondNum'], ['thirdNum', 'fourthNum']],
		friBlock: [['1', '11'], ['4', '23']]
	}
	
	expect(generateYoilBlocks(undefined)).toEqual(nullResponse)
	expect(generateYoilBlocks(oddLengthInput)).toEqual(nullResponse)
	expect(generateYoilBlocks(nullInput)).toEqual(nullResponse)
	expect(generateYoilBlocks(goodInput)).toEqual(goodResponse)
})

test('convertNullToEmptyArray', () => {
	const nulledInput = {
		mon: null,
		tue: "",
		wed: undefined,
		thur: NaN,
		fri: []
	}
	const expectedOutput = {
		mon: [],
		tue: [],
		wed: [],
		thur: [],
		fri: []
	}
	convertNullToEmptyArray(nulledInput)
	expect(nulledInput).toEqual(expectedOutput);
})

test('calculateSafetyZone_onlyMonday', async () => {
	const restrictOne = new Restriction({
		mon: [1, 3]
	});
	const restrictTwo = new Restriction({
		mon: [4, 7]
	});
	const restrictThree = new Restriction({
		mon: [9, 12]
	});
	const restrictFour = new Restriction({
		mon: [13, 17]
	});
	await restrictOne.save();
	await restrictTwo.save();
	await restrictThree.save();
	await restrictFour.save();
	const allRestrictions = await Restriction.find({});
	const safetyZone = await calculateSafetyZone();
	expect(safetyZone).toEqual([
		[   [minTime, 1], [3, 4], [7, 9], [12, 13], [17, maxTime]   ], 
		[   [minTime, maxTime]   ], 
		[   [minTime, maxTime]   ], 
		[   [minTime, maxTime]   ], 
		[   [minTime, maxTime]   ]
	]);
})

test('calculateSafetyZone_mondayAndTuesday', async () => {
	const restrictOne = new Restriction({
		mon: [1, 3],
		tue: [3, 7]
	});
	const restrictTwo = new Restriction({
		mon: [4, 7],
		tue: [5, 11]
	});
	const restrictThree = new Restriction({
		mon: [9, 12],
		tue: [2, 6]
	});
	const restrictFour = new Restriction({
		mon: [13, 17],
		tue: [9, 10]
	});
	await restrictOne.save();
	await restrictTwo.save();
	await restrictThree.save();
	await restrictFour.save();
	const allRestrictions = await Restriction.find({});
	const safetyZone = await calculateSafetyZone();
	expect(safetyZone).toEqual([
		[   [minTime, 1], [3, 4], [7, 9], [12, 13], [17, maxTime]   ], 
		[   [minTime, 2], [11, maxTime]   ], 
		[   [minTime, maxTime]   ], 
		[   [minTime, maxTime]   ], 
		[   [minTime, maxTime]   ]
	]);
})

test('calculateSafetyZone_complicatedCase', async () => {
	// edge cases (including minTime, maxTime as time-interval endpoints) included
	const restrictOne = new Restriction({
		mon: [1, 3],
		tue: [3, 7],
		wed: [2, 3]
	});
	const restrictTwo = new Restriction({
		mon: [4, 7],
		tue: [5, 11],
		wed: [2, 3]
	});
	const restrictThree = new Restriction({
		mon: [9, 12],
		tue: [2, 6],
		wed: [minTime, 3]
	});
	const restrictFour = new Restriction({
		mon: [13, 17],
		tue: [15, 19],
		wed: [4, 5]
	});
	const restrictFive = new Restriction({
		tue: [17, 18]
	});
	const restrictSix = new Restriction({
		tue: [18, maxTime],
		wed: [23, maxTime]
	})
	await restrictOne.save();
	await restrictTwo.save();
	await restrictThree.save();
	await restrictFour.save();
	await restrictFive.save();
	await restrictSix.save();
	const allRestrictions = await Restriction.find({});
	const safetyZone = await calculateSafetyZone();
	expect(safetyZone).toEqual([
		[   [minTime, 1], [3, 4], [7, 9], [12, 13], [17, maxTime]   ], 
		[   [minTime, 2], [11, 15]   ], 
		[   [3, 4], [5, 23]   ], 
		[   [minTime, maxTime]   ], 
		[   [minTime, maxTime]   ]
	]);
})

test('doesFit_testOne', async () => {
	const sampleSubject = {
		subjectName: 'sample',
		mon: [ [3, 4], [7, 11], [15, 18] ],
		tue: [],
		wed: [],
		thur: [],
		fri: [],
		weight: 5,
		mustTake: false,
		credit: 1
	};
	const safetyZone = [
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ]
	]
	const fit = doesFit(sampleSubject, safetyZone);
	expect(fit).toBe(true);
})

test('doesFit_testTwo', async () => {
	const sampleSubject = {
		subjectName: 'sample',
		mon: [ [3, 4], [7, 11], [15, 18] ],
		tue: [],
		wed: [],
		thur: [],
		fri: [],
		weight: 5,
		mustTake: false,
		credit: 1
	};
	const safetyZoneOne = [
		[ [minTime, 4], [6, 12], [14, 19] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ]
	];
	const safetyZoneTwo = [
		[ [minTime, 4], [6, 12], [16, 19] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ]
	];
	const safetyZoneThree = [
		[ [minTime, 4], [6, 12], [14, 19] ],
		[ [2, 3] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ],
		[ [minTime, maxTime] ]
	];
	const fit = doesFit(sampleSubject, safetyZoneOne);
	expect(fit).toBe(true);
	const fitTwo = doesFit(sampleSubject, safetyZoneTwo);
	expect(fitTwo).toBe(false);
	const fitThree = doesFit(sampleSubject, safetyZoneThree);
	expect(fitThree).toBe(true);
})

test('isPossibleCombination_one', async () => {
	const subjectOne = new Subject({
		subjectName: 'A',
		mon: [],
		tue: [ [1, 2] ],
		wed: [ [3, 4] ],
		thur: [ [5, 6] ],
		fri: [ [7, 8] ],
		weight: 1,
		mustTake: false,
		credit: 1
	})
	await subjectOne.save();
	const subjectTwo = new Subject({
		subjectName: 'B',
		mon: [],
		tue: [ [3, 4] ],
		wed: [ [5, 6] ],
		thur: [ [7, 8] ],
		fri: [ [9, 10] ],
		weight: 1,
		mustTake: false,
		credit: 1
	})
	await subjectTwo.save();
	const allSubjects = await Subject.find({});
	const iPCResult = isPossibleCombination(allSubjects);
	expect(iPCResult).toBe(true);
})

test('isPossibleCombination_two', async () => {
	const subjectOne = new Subject({
		subjectName: 'A',
		mon: [],
		tue: [ [1, 2] ],
		wed: [ [3, 4] ],
		thur: [ [5, 6] ],
		fri: [ [7, 14] ],
		weight: 1,
		mustTake: false,
		credit: 1
	})
	await subjectOne.save();
	const subjectTwo = new Subject({
		subjectName: 'B',
		mon: [],
		tue: [ [3, 4] ],
		wed: [ [5, 6] ],
		thur: [ [7, 8] ],
		fri: [ [13, 16] ],
		weight: 1,
		mustTake: false,
		credit: 1
	})
	await subjectTwo.save();
	const allSubjects = await Subject.find({});
	const iPCResult = isPossibleCombination(allSubjects);
	expect(iPCResult).toBe(false);
})

test('isPossibleCombination_three', async () => {
	const subjectOne = new Subject({
		subjectName: 'A',
		mon: [ [1, 2], [3, 4], [5, 6], [7, 8], [9, 10] ],
		tue: [ [minTime, 2] ],
		wed: [ [3, 4] ],
		thur: [ [5, 6] ],
		fri: [ [7, 14] ],
		weight: 1,
		mustTake: false,
		credit: 1
	})
	await subjectOne.save();
	const subjectTwo = new Subject({
		subjectName: 'B',
		mon: [ [minTime, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, maxTime] ],
		tue: [ [2, maxTime] ],
		wed: [ [4, 6] ],
		thur: [ [6, 8] ],
		fri: [ [14, 16] ],
		weight: 1,
		mustTake: false,
		credit: 1
	})
	await subjectTwo.save();
	const allSubjects = await Subject.find({});
	const iPCResult = isPossibleCombination(allSubjects);
	expect(iPCResult).toBe(true);
})

test('schedulize', async () => {
	const subjectOne = new Subject({
		subjectName: 'A',
		mon: [ [1, 3] ],
		tue: [ [minTime, maxTime] ],
		wed: [ ],
		thur: [ ],
		fri: [ ],
		weight: 1,
		mustTake: false,
		credit: 1
	})
	await subjectOne.save();
	const subjectTwo = new Subject({
		subjectName: 'B',
		mon: [ [2, 4] ],
		tue: [  ],
		wed: [ [minTime, maxTime] ],
		thur: [ ],
		fri: [ ],
		weight: 2,
		mustTake: false,
		credit: 1
	})
	await subjectTwo.save();
	const subjectThree = new Subject({
		subjectName: 'C',
		mon: [ [3, 5] ],
		tue: [ ],
		wed: [ ],
		thur: [ [minTime, maxTime] ],
		fri: [ ],
		weight: 3,
		mustTake: false,
		credit: 1
	})
	await subjectThree.save();
	const subjectFour = new Subject({
		subjectName: 'D',
		mon: [ [4, 6] ],
		tue: [  ],
		wed: [  ],
		thur: [ ],
		fri: [ [minTime, maxTime] ],
		weight: 4,
		mustTake: false,
		credit: 1
	})
	await subjectFour.save();
	const subjectFive = new Subject({
		subjectName: 'E',
		mon: [ [5, 7] ],
		tue: [  ],
		wed: [  ],
		thur: [ ],
		fri: [ ],
		weight: 5,
		mustTake: false,
		credit: 1
	})
	await subjectFive.save();
	
	const possibleClasses = await Subject.find({});
	
	const oneThreeFive = schedulize(possibleClasses, [1, 0, 1, 0, 1]);
	expect(oneThreeFive.selectedClasses.length).toBe(3);
	expect(oneThreeFive.sum).toBe(9);
	const twoFour = schedulize(possibleClasses, [0, 1, 0, 1, 0]);
	expect(twoFour.selectedClasses.length).toBe(2);
	expect(twoFour.sum).toBe(6);
	const twoFourFive = schedulize(possibleClasses, [0, 1, 0, 1, 1]);
	expect(twoFourFive).toBe(undefined);
	const twoThree = schedulize(possibleClasses, [0, 1, 1, 0, 0]);
	expect(twoThree).toBe(undefined);
})

test('calculateMaxIntervalSum', async () => {
	const banMonday = new Restriction({
		mon: [minTime, maxTime]
	});
	await banMonday.save();
	
	const subjectZero = new Subject({
		subjectName: 'z',
		mon: [ [2, 5] ],
		tue: [],
		wed: [ [2, 5] ],
		thur: [],
		fri: [ [2, 5] ],
		weight: 10,
		credit: 1
	})
	await subjectZero.save();
	const subjectOne = new Subject({
		subjectName: 'a',
		mon: [  ],
		tue: [ [3, 5] ],
		wed: [  ],
		thur: [ [3, 5] ],
		fri: [ ],
		weight: 4,
		credit: 1
	})
	await subjectOne.save();
	const subjectTwo = new Subject({
		subjectName: 'b',
		mon: [  ],
		tue: [ [4, 6] ],
		wed: [  ],
		thur: [ [4, 6] ],
		fri: [ [4, 6] ],
		weight: 10,
		credit: 1
	})
	await subjectTwo.save();
	const subjectThree = new Subject({
		subjectName: 'c',
		mon: [ ],
		tue: [],
		wed: [ [5, 6] ],
		thur: [],
		fri: [ [5, 6] ],
		weight: 7,
		credit: 1
	})
	await subjectThree.save();
	const subjectFour = new Subject({
		subjectName: 'd',
		mon: [ ],
		tue: [],
		wed: [ [5, 6] ],
		thur: [],
		fri: [  ],
		weight: 2,
		credit: 1
	})
	await subjectFour.save();
	
	
	const maxCredit = 500;
	let possibleSchedules = await calculateMaxIntervalSum(maxCredit);
	
	expect(possibleSchedules.length).toBe(7); // We don't have a schedule of no subjects, so not 8.
	expect(possibleSchedules[0].sum).toBe(12);
	expect(possibleSchedules[1].sum).toBe(11);
	expect(possibleSchedules[2].sum).toBe(10);
	expect(possibleSchedules[3].sum).toBe(7);
	expect(possibleSchedules[4].sum).toBe(6);
	expect(possibleSchedules[5].sum).toBe(4);
	expect(possibleSchedules[6].sum).toBe(2);
	
	await Subject.findOneAndUpdate({subjectName: 'c'}, {mustTake: true});
	
	let allSubjects = await Subject.find({});
	
	possibleSchedules = await calculateMaxIntervalSum(maxCredit);
	
	expect(possibleSchedules.length).toBe(2); // The [0, 0, ...] seed is discarded because 'c' is required. *It's not discarded because of candidateSchedule.selectedClasses.length check in calculateMaxIntervalSum() function*
	expect(possibleSchedules[0].sum).toBe(11);
	expect(possibleSchedules[1].sum).toBe(7);
})