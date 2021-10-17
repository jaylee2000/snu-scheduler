// CURRENTLY: ONLY TESTING WITH ONE USER

const request = require("supertest");
const app = require("../src/app.js");
const server = request.agent(app);

// Models
const { User } = require("../src/models/user");
const { Subject } = require("../src/models/subject");
const { ProvidedSubject } = require("../src/models/providedSubject");
const { Restriction } = require("../src/models/restriction");
const { MustTakeGroup } = require("../src/models/mustTakeGroup");

// Functions & Other Dependencies 
const { parseTimeIntervals, stringToArrays, generateIntervals } = require("../src/functions/parseTimeIntervals");
const { calculateSafetyZone, minTime, maxTime } = require("../src/functions/calculateSafetyZone");
const { calculateMaxIntervalSum, isPossibleCombination, schedulize, doesFit } = require("../src/functions/intervalScheduling");

// User A
const username = 'mysnu';
const password = 'nodejs1234!';
const email = 'mysnu@snu.ac.kr';
const userA_signup = { username, password, email };
const userA_login = { username,	password };

// User B
// const userB_signup = { username: 'myyonsei', password: 'nodejs5678@', email: 'myyonsei@yonsei.ac.kr' };
// const userB_login = { username: 'myyonsei', email: 'myyonsei@yonsei.ac.kr' };

//  // Subject A
// const subjectA_input = {
//     subjectName: "A",
//     mon: "2-4",
//     tue: "",
//     weight: "3",
//     credit: 1,
// };

// // Subject B
// const subjectB_input = {
// 	subjectName: "B",
//     mon: "12-14",
//     tue: "",
// 	fri: "21-22, 23-24",
//     weight: "3",
//     credit: 1,
// }



describe('parseTimeIntervals.js', function() {
	test("stringToArrays", () => {
		const mon = "     ",
        	tue = "234-23452345-23423",
        	wed = "14;-134;-43..23.4",
        	thur = "1&#$@%-1",
        	fri = undefined;
		const result = stringToArrays(mon, tue, wed, thur, fri);
		expect(result.mon).toEqual([]);
		expect(result.tue).toEqual(["234", "23452345", "23423"]);
    	expect(result.wed).toEqual(["14", "134", "43", "23", "4"]); // negative numbers unallowed
    	expect(result.thur).toEqual(["1", "1"]); // negative numbers unallowed
    	expect(result.fri).toEqual([]);
	})
	test("generateIntervals", () => {
		const oddLengthInput = {
			mon: ["1", "4", "5"],
			tue: ["4", "7"],
			wed: [],
			thur: [],
			fri: [],
		};

		const nullInput = {
			mon: null,
			tue: undefined,
			thur: ["3", "4"],
		};

		const goodInput = {
			mon: ["3", "4"],
			thur: ["firstNum", "secondNum", "thirdNum", "fourthNum"],
			fri: ["1", "11", "4", "23"],
		};

		const nullResponse = {
			mon: [],
			tue: [],
			wed: [],
			thur: [],
			fri: [],
		};

		const goodResponse = {
			mon: [["3", "4"]],
			tue: [],
			wed: [],
			thur: [
				["firstNum", "secondNum"],
				["thirdNum", "fourthNum"],
			],
			fri: [
				["1", "11"],
				["4", "23"],
			],
		};
		
		expect(generateIntervals(undefined)).toEqual(nullResponse);
		expect(generateIntervals(oddLengthInput)).toEqual(nullResponse);
		expect(generateIntervals(nullInput)).toEqual(nullResponse);
		expect(generateIntervals(goodInput)).toEqual(goodResponse);
	})
})

describe('calculateSafetyZone', function () {
	beforeEach(async () => {
		await User.deleteMany({});
		await Restriction.deleteMany({});
		
		// Register User A
		await server.post("/register").send(userA_signup);
	})
	test("Monday, User A", async () => {
		// User A
		const user = await User.findOne({});
		const userId = user._id.toString();
		
		// Create 4 restrictions
		const restrictOne = { mon: "1-3" };
		const restrictTwo = { mon: "4-7" };
		const restrictThree = { mon: "9-12" };
		const restrictFour = { mon: "13-17" };
		
		await server.post("/restriction").send(restrictOne);
		await server.post("/restriction").send(restrictTwo);
		await server.post("/restriction").send(restrictThree);
		await server.post("/restriction").send(restrictFour);
		
		const safetyZone = await calculateSafetyZone(userId);
		expect(safetyZone).toEqual([
			[
				[minTime, 1],
				[3, 4],
				[7, 9],
				[12, 13],
				[17, maxTime],
			],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]]
		]);
	});
	
	test("Monday And Tuesday, User A", async () => {
		// User A
		const user = await User.findOne({});
		const userId = user._id.toString();
		
		// Create 4 restrictions
		const restrictOne = { mon: "1-3", tue: "3-7" };
		const restrictTwo = { mon: "4-7", tue: "5-11" };
		const restrictThree = { mon: "9-12", tue: "2-6" };
		const restrictFour = { mon: "13-17", tue: "9-10" };
		
		await server.post("/restriction").send(restrictOne);
		await server.post("/restriction").send(restrictTwo);
		await server.post("/restriction").send(restrictThree);
		await server.post("/restriction").send(restrictFour);
		
		const safetyZone = await calculateSafetyZone(userId);
		
		expect(safetyZone).toEqual([
			[
				[minTime, 1],
				[3, 4],
				[7, 9],
				[12, 13],
				[17, maxTime],
			],
			[
				[minTime, 2],
				[11, maxTime],
			],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]]
		]);
	})
	
	test("Complicated Case - Including Time Interval Endpoints", async () => {
		// User A
		const user = await User.findOne({});
		const userId = user._id.toString();
		
		// Create 6 restrictions
		const restrictOne = { mon: "1-3", tue: "3-7", wed: "2-3" };
		const restrictTwo = { mon: "4-7", tue: "5-11", wed: "2-3" };
		const restrictThree = { mon: "9-12", tue: "2-6", wed: "0-3" }; // wed: minTime ~ 3
		const restrictFour = { mon: "13-17", tue: "9-10", wed: "4-5" };
		const restrictFive = { tue: "17-18" };
		const restrictSix = { tue: "18-24", wed: "23-24" } // tue: 18 ~ maxTime, wed: 23 ~ maxTime
		
		await server.post("/restriction").send(restrictOne);
		await server.post("/restriction").send(restrictTwo);
		await server.post("/restriction").send(restrictThree);
		await server.post("/restriction").send(restrictFour);
		await server.post("/restriction").send(restrictFive);
		await server.post("/restriction").send(restrictSix);
		
		const safetyZone = await calculateSafetyZone(userId);
		expect(safetyZone).toEqual([
			[
				[minTime, 1],
				[3, 4],
				[7, 9],
				[12, 13],
				[17, maxTime]
			],
			[
				[minTime, 2],
				[11, 17]
			],
			[
				[3, 4],
				[5, 23],
			],
			[[minTime, maxTime]],
			[[minTime, maxTime]]
		]);
	})
})

describe('doesFit', function () {
	it('Simple Case', () => {
		const sampleSubject = {
			subjectName: "sample",
			mon: [
				[3, 4],
				[7, 11],
				[15, 18],
			],
			tue: [],
			wed: [],
			thur: [],
			fri: [],
			weight: 5,
			mustTake: false,
			credit: 1,
		};
		const safetyZone = [
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
		];
		const fit = doesFit(sampleSubject, safetyZone);
		expect(fit).toBe(true);
	});
	it('Complex Case', () => {
		const sampleSubject = {
			subjectName: "sample",
			mon: [
				[3, 4],
				[7, 11],
				[15, 18],
			],
			tue: [],
			wed: [],
			thur: [],
			fri: [],
			weight: 5,
			mustTake: false,
			credit: 1,
		};
		const safetyZoneOne = [
			[
				[minTime, 4],
				[6, 12],
				[14, 19],
			],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
		];
		const safetyZoneTwo = [
			[
				[minTime, 4],
				[6, 12],
				[16, 19],
			],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
		];
		const safetyZoneThree = [
			[
				[minTime, 4],
				[6, 12],
				[14, 19],
			],
			[[2, 3]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
			[[minTime, maxTime]],
		];
		const fit = doesFit(sampleSubject, safetyZoneOne);
		expect(fit).toBe(true);
		const fitTwo = doesFit(sampleSubject, safetyZoneTwo);
		expect(fitTwo).toBe(false);
		const fitThree = doesFit(sampleSubject, safetyZoneThree);
		expect(fitThree).toBe(true);
	});
})

describe('isPossibleCombination', function () {
	beforeEach(async () => {
		await User.deleteMany({});
		await Restriction.deleteMany({});
		await Subject.deleteMany({});
		await MustTakeGroup.deleteMany({});
		
		// Register User A
		await server.post("/register").send(userA_signup);
	});
	it('Case 1', async () => {
		// User A
		const user = await User.findOne({});
		const userId = user._id.toString();
		
		// Create subjects
		const subjectOne = {
			subjectName: 'A',
			tue: '1-2',
			wed: '3-4',
			thur: '5-6',
			fri: '7-8',
			weight: 1,
			mustTake: false,
			credit: 1
		};
		const subjectTwo = {
			subjectName: 'B',
			tue: '3-4',
			wed: '5-6',
			thur: '7-8',
			fri: '9-10',
			weight: 1,
			mustTake: false,
			credit: 1
		};
		await server.post("/subject").send(subjectOne);
		await server.post("/subject").send(subjectTwo);
		
		const allSubjects = await Subject.find({owner: userId});
		const result = await isPossibleCombination(allSubjects);
		expect(result).toBe(true);
	});
	it('Case 2', async () => {
		// User A
		const user = await User.findOne({});
		const userId = user._id.toString();
		
		// Create subjects
		const subjectOne = {
			subjectName: 'A',
			tue: '1-2',
			wed: '3-4',
			thur: '5-6',
			fri: '7-14',
			weight: 1,
			mustTake: false,
			credit: 1
		};
		const subjectTwo = {
			subjectName: 'B',
			tue: '3-4',
			wed: '5-6',
			thur: '7-8',
			fri: '13-16',
			weight: 1,
			mustTake: false,
			credit: 1
		};
		await server.post("/subject").send(subjectOne);
		await server.post("/subject").send(subjectTwo);
		
		const allSubjects = await Subject.find({owner: userId});
		const result = await isPossibleCombination(allSubjects);
		expect(result).toBe(false);
	});
	it('Case 3', async () => {
		// User A
		const user = await User.findOne({});
		const userId = user._id.toString();
		
		// Create subjects
		const subjectOne = {
			subjectName: 'A',
			mon: '1-2, 3-4, 5-6, 7-8, 9-10',
			tue: '0-2', // minTime
			wed: '3-4',
			thur: '5-6',
			fri: '7-14',
			weight: 1,
			mustTake: false,
			credit: 1
		};
		const subjectTwo = {
			subjectName: 'B',
			mon: '0-1, 2-3, 4-5, 6-7, 8-9, 10-24', // minTime, maxTime
			tue: '2-24', // maxTime
			wed: '4-6',
			thur: '6-8',
			fri: '14-16',
			weight: 1,
			mustTake: false,
			credit: 1
		};
		await server.post("/subject").send(subjectOne);
		await server.post("/subject").send(subjectTwo);
		
		const allSubjects = await Subject.find({owner: userId});
		const result = await isPossibleCombination(allSubjects);
		expect(result).toBe(true);
	})
});

describe('Schedulize', function() {
	beforeEach(async () => {
		await User.deleteMany({});
		await Restriction.deleteMany({});
		await Subject.deleteMany({});
		await MustTakeGroup.deleteMany({});
		
		// Register User A
		await server.post("/register").send(userA_signup);
	});
	it('Case 1 - One User', async () => {
		// User A
		const user = await User.findOne({});
		const userId = user._id.toString();
		
		// Create subjects
		const subjectOne = {
			subjectName: 'A',
			mon: '1-3',
			tue: '0-24', // minTime, maxTime
			weight: 1,
			mustTake: false,
			credit: 1
		};
		const subjectTwo = {
			subjectName: 'B',
			mon: '2-4',
			wed: '0-24', // minTime, maxTime
			weight: 2,
			mustTake: false,
			credit: 1
		};
		const subjectThree = {
			subjectName: 'C',
			mon: '3-5',
			thur: '0-24', // minTime, maxTime
			weight: 3,
			mustTake: false,
			credit: 1
		};
		const subjectFour = {
			subjectName: 'D',
			mon: '4-6',
			fri: '0-24', // minTime, maxTime
			weight: 4,
			mustTake: false,
			credit: 1
		};
		const subjectFive = {
			subjectName: 'E',
			mon: '5-7',
			weight: 5,
			mustTake: false,
			credit: 1
		};
		await server.post("/subject").send(subjectOne);
		await server.post("/subject").send(subjectTwo);
		await server.post("/subject").send(subjectThree);
		await server.post("/subject").send(subjectFour);
		await server.post("/subject").send(subjectFive);
		
		const allSubjects = await Subject.find({owner: userId});
		
		const oneThreeFive = await schedulize(allSubjects, [1, 0, 1, 0, 1], userId);
		expect(oneThreeFive.selectedClasses.length).toBe(3);
		expect(oneThreeFive.weightSum).toBe(9);
		
		const twoFour = await schedulize(allSubjects, [0, 1, 0, 1, 0], userId);
		expect(twoFour.selectedClasses.length).toBe(2);
		expect(twoFour.weightSum).toBe(6);
		
		const twoFourFive = await schedulize(allSubjects, [0, 1, 0, 1, 1], userId);
		expect(twoFourFive).toBe(undefined);
		
		const twoThree = await schedulize(allSubjects, [0, 1, 1, 0, 0], userId);
		expect(twoThree).toBe(undefined);
	});
});

describe('calculateMaxIntervalSum', function() {
	beforeEach(async () => {
		await User.deleteMany({});
		await Restriction.deleteMany({});
		await Subject.deleteMany({});
		await MustTakeGroup.deleteMany({});
		
		// Register User A
		await server.post("/register").send(userA_signup);
	})
	it('Case 1 - One User', async () => { // Failing
		// User A
		const user = await User.findOne({});
		const userId = user._id.toString();
		
		// Add Restriction: Ban Monday
		const banMonday = {
			mon: "0-24" // minTime, maxTime
		};
		await server.post("/restriction").send(banMonday);
		
		// Add Five Subjects
		const subjectZero = {
			subjectName: "z",
			mon: "2-5",
			wed: "2-5",
			fri: "2-5",
			weight: 10,
			credit: 1
		};
		const subjectOne = {
			subjectName: "a",
			tue: "3-5",
			thur: "3-5",
			weight: 4,
			credit: 1
		};
		const subjectTwo = {
			subjectName: "b",
			tue: "4-6",
			thur: "4-6",
			fri: "4-6",
			weight: 10,
			credit: 1
		};
		const subjectThree = {
			subjectName: "c",
			wed: "5-6",
			fri: "5-6",
			weight: 7,
			credit: 1
		};
		const subjectFour = {
			subjectName: "d",
			wed: "5-6",
			weight: 2,
			credit: 1
		};
		await server.post("/subject").send(subjectZero);
		await server.post("/subject").send(subjectOne);
		await server.post("/subject").send(subjectTwo);
		await server.post("/subject").send(subjectThree);
		await server.post("/subject").send(subjectFour);
		
		const maxCredit = 30;
		let possibleSchedules = await calculateMaxIntervalSum(maxCredit, userId);
		
		expect(possibleSchedules.length).toBe(7); // We don't have a schedule of no subjects, so not 8.
		
		expect(possibleSchedules[0].weightSum).toBe(12);
		expect(possibleSchedules[1].weightSum).toBe(11);
		expect(possibleSchedules[2].weightSum).toBe(10);
		expect(possibleSchedules[3].weightSum).toBe(7);
		expect(possibleSchedules[4].weightSum).toBe(6);
		expect(possibleSchedules[5].weightSum).toBe(4);
		expect(possibleSchedules[6].weightSum).toBe(2);
		
		// Update subjectThree
		const updateTarget = await Subject.findOne({subjectName: 'c'});
		const updateId = updateTarget._id.toString(); // NO PROBLEM UNTIL HERE!!
		
		await server.patch(`/subject/${updateId}`).send({ // NOT BEING UPDATED HERE!!
			subjectName: "c",
			wed: "5-6",
			fri: "5-6",
			weight: 7,
			credit: 4,
			mustTake: "true" // Has to be string
		});
		
		const _updateTarget = await Subject.findOne({subjectName: 'c'});
		
		possibleSchedules = await calculateMaxIntervalSum(maxCredit, userId);
		expect(possibleSchedules.length).toBe(2); // The [0, 0, ...] seed is discarded because 'c' is required. *It's not discarded because of candidateSchedule.selectedClasses.length check in calculateMaxIntervalSum() function*
		expect(possibleSchedules[0].weightSum).toBe(11);
		expect(possibleSchedules[1].weightSum).toBe(7);
	})
})