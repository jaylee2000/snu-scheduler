const request = require("supertest");
const app = require("../src/app.js");
const server = request.agent(app);
const { User } = require("../src/models/user");
const { Subject } = require("../src/models/subject");
const { ProvidedSubject } = require("../src/models/providedSubject");


// User A
const username = 'mysnu';
const password = 'nodejs1234!';
const email = 'mysnu@snu.ac.kr';
const userA_signup = { username, password, email };
const userA_login = { username,	password };
const userB_signup = { username: 'myyonsei', password: 'nodejs5678@', email: 'myyonsei@yonsei.ac.kr' };
const userB_login = { username: 'myyonsei', email: 'myyonsei@yonsei.ac.kr' };

// Subject A
const subjectA_input = {
    subjectName: "A",
    mon: "2-4",
    tue: "",
    weight: "3",
    credit: 1,
};

describe('Fail CRUD Subjects without login', function() {
	beforeAll(async () => {
		await User.deleteMany({});
		await Subject.deleteMany({});
	});
	
	it('Create fail', async () => {
		const response = await server.post("/").send(subjectA_input).expect(302);
		expect(response.header.location).toBe('/login');
		
		const allSubjects = await Subject.find({});
		expect(allSubjects.length).toBe(0);
	})
	it('Read fail', async () => {
		const response = await server.get("/").expect(302);
		expect(response.header.location).toBe('/login');
	})
	it('Update/Delete fail', async () => {
		// Register
		const registerResponse = await server.post("/register").send(userA_signup);
		const user = await User.findOne({username: 'mysnu'});
		const userId = user._id.toString();
		
		// Create a subject
		await server.post("/").send(subjectA_input);
		const aSubjects = await Subject.find({owner: userId});
		expect(aSubjects.length).toBe(1);
		const subjectId = aSubjects[0]._id.toString();
		const ownerId = aSubjects[0].owner.toString();
		expect(ownerId).toBe(userId);
		
		// Logout
		await server.get("/logout");
		
		// Try to update subject
		const updateResponse = await server.patch(`/${subjectId}`).expect(302);
		expect(updateResponse.header.location).toBe('/login');
		
		// Try to delete subject
		const deleteResponse = await server.patch(`/${subjectId}`).expect(302);
		expect(deleteResponse.header.location).toBe('/login');
	})
})

// Subject Created By User
describe('Success CRUD Subjects with login', function() {
	beforeAll(async () => {
		await User.deleteMany({});
		await Subject.deleteMany({});
		
		// Register User A
		await server.post("/register").send(userA_signup);
			// const user = await User.findOne({username: 'mysnu'});
			// const userId = user._id.toString();
			// console.log(userId);
		
		// Logout
		await server.get("/logout");
	});
	it('Login as User A', async () => {
		const response = await server.post("/login").send(userA_login).expect(302);
		// returnTo behavior causes bug here...
		expect(response.header.location).toBe('/'); // Why /:id ?? And the ID differs by 6 from userId... WTF??
		await server.get(`${response.header.location}`).expect(200); // We're getting 404.
	});
	it('Create subject', async () => {
		const response = await server.post("/").send(subjectA_input).expect(302);
		expect(response.header.location).toBe('/');
	});
	it('Read subjects', async () => {
		const response = await server.get("/").expect(200);
		expect(response.header.location == '/' || response.header.location == undefined).toBeTruthy();
	});
	it('Update / Delete subjects', async () => {
		let theSubject = await Subject.findOne({});
		const subjectId = theSubject._id.toString();
		let response = await server.patch(`/${subjectId}`).send({
			subjectName: "C",
			fri: "4-11",
			credit: 4,
			weight: "3",
			roomNum: "23"
		}).expect(302);
		
		expect(response.header.location).toBe('/');
		theSubject = await Subject.findOne({});
		expect(theSubject.fri).toEqual([[4, 11]]);
		
		response = await server.delete(`/${subjectId}`).expect(302);
		expect(response.header.location).toBe('/');
		theSubject = await Subject.findOne({});
		expect(theSubject).toBe(null);
	})
	it('Create subject from providedSubject', async () => {
		const user = await User.findOne({username: 'mysnu'});
		const userId = user._id.toString();
		
		const providedSubject = await ProvidedSubject.findOne({subjectName: "반도체소자특강"});
		const providedSubjectId = providedSubject._id.toString();
		const response = await server.post(`/database/add/${providedSubjectId}`).expect(302);
		expect(response.header.location).toBe('/');
		const subjects = await Subject.find({owner: userId});
		expect(subjects.length).toBe(1);
		expect(subjects[0].lectureHours).toBe(3);
	})
	it('Update / Delete subject from providedSubject', async () => {
		let theSubject = await Subject.findOne({subjectName: "반도체소자특강"});
		const subjectId = theSubject._id.toString();
		let response = await server.patch(`/${subjectId}`).send({
			subjectName: "C",
			fri: "4-11",
			credit: 4,
			weight: "3",
			roomNum: "23",
			classification: "Yay!"
		}).expect(302); // Not sure when this turns to 400 Bad Request... Need to clean up code for subject CRUD, model
	})
})

Subject Created By User
describe('Cannot UD Subjects of other users', function() {
	beforeAll(async () => {
		await User.deleteMany({});
		await Subject.deleteMany({});
		
		// Register User A
		await server.post("/register").send(userA_signup);
		
		// Add a Subject
		await server.post("/").send(subjectA_input);
		
		// Logout
		await server.get("/logout");
		
		// Register User B
		await server.post("/register").send(userB_signup);
	});
	it('Attempt Update / Delete', async () => {
		let subjectOfA = await Subject.findOne({username});
		const subjectId = subjectOfA._id.toString();
		
		let response = await server.patch(`/${subjectId}`).send({
			subjectName: "C",
			fri: "4-11",
			credit: 4,
			weight: "3",
			roomNum: "23"
		}).expect(302);
		
		expect(response.header.location).toBe('/');
		subjectOfA = await Subject.findOne({username});
		expect(subjectOfA.subjectName).toBe('A');
		
		response = await server.delete(`/${subjectId}`).expect(302);
		expect(response.header.location).toBe('/');
		subjectOfA = await Subject.findOne({username});
		expect(subjectOfA).not.toEqual(undefined);
	});
})