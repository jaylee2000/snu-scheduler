const request = require('supertest')
const app = require('../src/app')
const { Subject } = require("../src/models/subject");
const { Restriction } = require("../src/models/restriction");

// beforeEach(() => {
// 	setupDatabase();
// })

test('Add a subject', async () => {
	await request(app).get("/").expect(200);
	
	await request(app).post("/").send({
		subjectName: 'Algebra 201',
		weight: 3
	}).expect(302); // redirect
	
	const algebra201 = await Subject.find({
		subjectName: 'Algebra 201',
		weight: 3
	})
})

afterEach( async () => {
	await Subject.remove({});
	await Restriction.remove({});
})