const request = require('supertest')
const app = require('../src/app')
const { Subject } = require("../src/models/subject");

const subjectA_input = {
	subjectName: "A",
	mon: "2-4",
	tue: "",
	weight: "3"
}

const subjectA_stored = {
	subjectName: "A",
	mon: [[2, 4]],
	tue: [],
	wed: [],
	thur: [],
	fri: [],
	weight: 3,
	mustTake: false
}


beforeEach( async () => {
	await request(app).post("/").send(subjectA_input).expect(302); // redirect
})


test('Create a subject and find it', async () => {
	const theSubject = await Subject.find(subjectA_stored);
	expect(theSubject).not.toEqual(undefined);
})

test('Read all subjects', async () => {
	const subjectB_input = {
		subjectName: "B",
		mon: "2-4, 11-16, 17-23",
		tue: "4-5",
		wed: "",
		weight: "3"
	}
	
	await request(app).post("/").send(subjectB_input).expect(302); // redirect
	
	const allSubjects = await Subject.find({});
	expect(allSubjects.length).toBe(2);

	await request(app).get("/").expect(200);
})

test('Update a subject', async () => {
	const A = await Subject.findOne(subjectA_stored);
	const updateDetails = {
		subjectName: "A",
		mon: "   ...// ",
		tue: "6-11, 13-17",
		weight: 3,
		mustTake: true
	}
	
	const updateDetailsStored = {
		subjectName: "A",
		mon: [],
		tue: [[6, 11], [13, 17]],
		wed: [],
		thur: [],
		fri: [],
		weight: 3,
		mustTake: true
	}
	
	await request(app).patch(`/${A._id}`).send(updateDetails).expect(302); // redirect
	
	const updatedSubjectFail = await Subject.find(subjectA_stored);
	expect(updatedSubjectFail.length).toBe(0);
	
	const updatedSubjectSuccess = await Subject.find(updateDetailsStored);
	expect(updatedSubjectSuccess).not.toEqual(undefined);
})

test('Delete a subject', async () => {
	const A = await Subject.findOne(subjectA_stored);
	await request(app).delete(`/${A._id}`).expect(302); // redirect
	const allSubjects = await Subject.find({});
	expect(allSubjects.length).toBe(0);
})

afterEach( async () => {
	await Subject.deleteMany({});
})