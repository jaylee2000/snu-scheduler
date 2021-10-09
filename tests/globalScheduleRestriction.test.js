const request = require("supertest");
const app = require("../src/app");

const { Subject } = require("../src/models/subject.js");
const { Restriction } = require("../src/models/restriction.js");
const { MustTakeGroup } = require("../src/models/mustTakeGroup.js");
const { calculateMaxIntervalSum } = require("../src/functions/intervalScheduling");

beforeEach(async () => {
    await Restriction.deleteMany({});
    await Subject.deleteMany({});
	await MustTakeGroup.deleteMany({});
});

afterEach(async () => {
    await Restriction.deleteMany({});
    await Subject.deleteMany({});
	await MustTakeGroup.deleteMany({});
});

// Test for duplicate subjectNames
test('Rejects duplicate subjectNames', async () => {
	const subjectOne = new Subject({
		subjectName: 'Duplicate',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 1,
    });
	const subjectTwo = new Subject({
		subjectName: 'Duplicate',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 1,
    });
	await subjectOne.save();
	await subjectTwo.save();
	
	const maxCredit = 3;
	const possibleSchedules = await calculateMaxIntervalSum(maxCredit);
	expect(possibleSchedules.length).toBe(2);
})

// Test for exceeding maxCredit
test('Cannot exceed maxCredit', async () => {
	const subjectOne = new Subject({
		subjectName: 'subjectOne',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 1
	});
	const subjectTwo = new Subject({
		subjectName: 'subjectTwo',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 2
    });
	const subjectThree = new Subject({
		subjectName: 'subjectThree',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 3
	});
	const subjectFour = new Subject({
		subjectName: 'subjectFour',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 4
    });
	await subjectOne.save();
	await subjectTwo.save();
	await subjectThree.save();
	await subjectFour.save();
	
	let maxCredit = 10;
	let possibleSchedules = await calculateMaxIntervalSum(maxCredit);
	expect(possibleSchedules.length).toBe(15);
	
	maxCredit = 6;
	possibleSchedules = await calculateMaxIntervalSum(maxCredit);	
	expect(possibleSchedules.length).toBe(10);
	
	maxCredit = 4;
	possibleSchedules = await calculateMaxIntervalSum(maxCredit);
	expect(possibleSchedules.length).toBe(6);
})

// Test for MustTakeGroup
test('Must Take at least one per group', async () => {
	const subjectOne = new Subject({
		subjectName: 'subjectOne',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 1
	});
	const subjectTwo = new Subject({
		subjectName: 'subjectTwo',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 2
    });
	const subjectThree = new Subject({
		subjectName: 'subjectThree',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 3
	});
	const subjectFour = new Subject({
		subjectName: 'subjectFour',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 4
    });
	const subjectFive = new Subject({
		subjectName: 'subjectFive',
		mon: [],
        tue: [],
        wed: [],
        thur: [],
        fri: [],
        weight: 1,
        mustTake: false,
        credit: 5
    });
	const a = await subjectOne.save();
	const b = await subjectTwo.save();
	const c = await subjectThree.save();
	const d = await subjectFour.save();
	const e = await subjectFive.save();
	
	const MustTakeGroupOne = new MustTakeGroup({
		name: 'GroupOne',
		members: [a._id, b._id],
		minSelection: 1,
		maxSelection: 2
	});
	const MustTakeGroupTwo = new MustTakeGroup({
		name: 'GroupTwo',
		members: [c._id, d._id, e._id],
		minSelection: 1,
		maxSelection: 3
	});
	await MustTakeGroupOne.save();
	await MustTakeGroupTwo.save();
	
	let maxCredit = 15;
	let possibleSchedules = await calculateMaxIntervalSum(maxCredit);
	expect(possibleSchedules.length).toBe(21);
})