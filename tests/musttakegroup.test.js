const request = require("supertest");
const app = require("../src/app.js");
const server = request.agent(app);
const { User } = require("../src/models/user");
const { Subject } = require("../src/models/subject");
const { ProvidedSubject } = require("../src/models/providedSubject");
const { MustTakeGroup } = require("../src/models/mustTakeGroup");

// User A
const username = 'mysnu';
const password = 'nodejs1234!';
const email = 'mysnu@snu.ac.kr';
const userA_signup = { username, password, email };
const userA_login = { username,	password };

// User B
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

// Subject B
const subjectB_input = {
	subjectName: "B",
    mon: "12-14",
    tue: "",
	fri: "21-22, 23-24",
    weight: "3",
    credit: 1,
}

describe('Fail CRUD MustTakeGroup without login', function() {
	beforeAll(async () => {
		await User.deleteMany({});
		await Subject.deleteMany({});
		await MustTakeGroup.deleteMany({});
	});
	
	it('Create fail', async () => {
		const response = await server.post("/musttake").expect(302);
		expect(response.header.location).toBe('/login');
		
		const allGroups = await MustTakeGroup.find({});
		expect(allGroups.length).toBe(0);
	})
	it('Read fail', async () => {
		const response = await server.get("/musttake").expect(302);
		expect(response.header.location).toBe('/login');
	})
	it('Update/Delete fail', async () => {
		// Register
		const registerResponse = await server.post("/register").send(userA_signup);
		const user = await User.findOne({username: 'mysnu'});
		const userId = user._id.toString();
		
		// Create subjects
		await server.post("/subject").send(subjectA_input);
		await server.post("/subject").send(subjectB_input);
		const aSubjects = await Subject.find({owner: userId});
		expect(aSubjects.length).toBe(2);
		// Retrieve IDs
		const subjectAId = aSubjects[0]._id.toString();
		const subjectBId = aSubjects[1]._id.toString();
		
		// Create MustTakeGroup
		const newGroup = {
			name: 'Example Group',
			members: [subjectAId,subjectBId],
			minSelection: 1,
			maxSelection: 2
		};
		await server.post("/musttake").send(newGroup);
		const aGroups = await MustTakeGroup.find({owner: userId});
		expect(aGroups.length).toBe(1);
		// Retrieve ID
		const groupId = aGroups[0]._id.toString();
		
		// Logout
		await server.get("/logout");
		
		// Try to update MustTakeGroup
		const updateResponse = await server.patch(`/musttake/${groupId}`).expect(302);
		expect(updateResponse.header.location).toBe('/login');
		
		// Try to delete subject
		const deleteResponse = await server.delete(`/musttake/${groupId}`).expect(302);
		expect(deleteResponse.header.location).toBe('/login');
	})
})

describe('Success CRUD MustTakeGroups with login', function() {
	beforeAll(async () => {
		await User.deleteMany({});
		await Subject.deleteMany({});
		await MustTakeGroup.deleteMany({});
		
		// Register User A -> Stay logged in
		await server.post("/register").send(userA_signup);
		
		// Create subjects
		await server.post("/subject").send(subjectA_input);
		await server.post("/subject").send(subjectB_input);
	});
	it('Create group', async () => {
		const user = await User.findOne({username: 'mysnu'});
		const userId = user._id.toString();
		
		const aSubjects = await Subject.find({owner: userId});
		const subjectAId = aSubjects[0]._id.toString();
		const subjectBId = aSubjects[1]._id.toString();
		
		const newGroup = {
			name: 'Example Group',
			members: [subjectAId,subjectBId],
			minSelection: 1,
			maxSelection: 2
		};
		
		const response = await server.post("/musttake").send(newGroup).expect(302);
		expect(response.header.location).toBe('/musttake');
	});
	it('Read groups', async () => {
		const response = await server.get("/musttake").expect(200);
		expect(response.header.location == '/musttake' || response.header.location == undefined).toBeTruthy();
	});
	it('Update / Delete groups', async () => {
		const user = await User.findOne({username: 'mysnu'});
		const userId = user._id.toString();
		
		const aSubjects = await Subject.find({owner: userId});
		const subjectAId = aSubjects[0]._id.toString();
		const subjectBId = aSubjects[1]._id.toString();
		
		let theGroup = await MustTakeGroup.findOne({});
		const groupId = theGroup._id.toString();
		let response = await server.patch(`/musttake/${groupId}`).send({
			name: 'Changed Group',
			members: [subjectAId],
			minSelection: 0,
			maxSelection: 1
		}).expect(302);
		
		expect(response.header.location).toBe('/musttake');
		theGroup = await MustTakeGroup.findOne({});
		expect(theGroup.name).toBe('Changed Group');
		
		response = await server.delete(`/musttake/${groupId}`).expect(302);
		expect(response.header.location).toBe('/musttake');
		theGroup = await MustTakeGroup.findOne({});
		expect(theGroup).toBe(null);
	});
})

describe('Cannot UD MustTakeGroups of other users', function() {
	beforeAll(async () => {
		await User.deleteMany({});
		await Subject.deleteMany({});
		await MustTakeGroup.deleteMany({});
		
		// Register User A -> Stay logged in
		await server.post("/register").send(userA_signup);
		
		// Create subjects
		await server.post("/subject").send(subjectA_input);
		await server.post("/subject").send(subjectB_input);
		
		const user = await User.findOne({username: 'mysnu'});
		const userId = user._id.toString();
		
		const aSubjects = await Subject.find({owner: userId});
		const subjectAId = aSubjects[0]._id.toString();
		const subjectBId = aSubjects[1]._id.toString();
		
		// Create MustTakeGroup
		const newGroup = {
			name: 'Example Group',
			members: [subjectAId,subjectBId],
			minSelection: 1,
			maxSelection: 2
		};
		await server.post("/musttake").send(newGroup);
		
		// Logout
		await server.get("/logout");
		
		// Register User B
		await server.post("/register").send(userB_signup);
	});
	it('Attempt Update / Delete', async () => {
		let groupOfA = await MustTakeGroup.findOne({});
		const groupId = groupOfA._id.toString();
		
		const user = await User.findOne({username: 'mysnu'});
		const userId = user._id.toString();
		const aSubjects = await MustTakeGroup.find({owner: userId});
		const subjectAId = aSubjects[0]._id.toString();
		
		let response = await server.patch(`/musttake/${groupId}`).send({
			name: 'Changed Group',
			members: [subjectAId],
			minSelection: 0,
			maxSelection: 1
		}).expect(302);
		
		expect(response.header.location).toBe('/');
		groupOfA = await MustTakeGroup.findOne({});
		expect(groupOfA.name).toBe('Example Group');
		
		response = await server.delete(`/musttake/${groupId}`).expect(302);
		expect(response.header.location).toBe('/');
		groupOfA = await MustTakeGroup.findOne({});
		expect(groupOfA).not.toEqual(undefined);
	})
})