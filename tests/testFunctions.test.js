const request = require('supertest');
const app = require('../src/app');
const { parseSubjectInput } = require("../src/functions/parseSubjectInput");
const { generateYoilBlocks } = require("../src/functions/generateYoilBlocks");
const { convertNullToEmptyArray } = require("../src/functions/convertNullToEmptyArray_Yoil");
const { calculateSafetyZone } = require("../src/functions/calculateSafetyZone");
const { calculateMaxIntervalSum } = require("../src/functions/intervalScheduling");

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

test('calculateSafetyZone', () => {
	
})

test('calculateMaxIntervalSum', () => {
	
})