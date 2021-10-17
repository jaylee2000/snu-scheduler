const request = require("supertest");
const app = require("../src/app.js");
const server = request.agent(app);
const { User } = require("../src/models/user");
const { Restriction } = require("../src/models/restriction");

// User A
const userA_signup = { username: 'mysnu', 
					  password: 'nodejs1234!', 
					  email: 'mysnu@snu.ac.kr' };
const userA_login = { username: 'mysnu',
					 password: 'nodejs1234!' };
const userB_signup = { username: 'myyonsei', 
					  password: 'nodejs5678@', 
					  email: 'myyonsei@yonsei.ac.kr' };
const userB_login = { username: 'myyonsei', 
					 email: 'myyonsei@yonsei.ac.kr' };

// Restriction A
const restrictionA_input = {
	restrictionName: "A",
	mon: "2-4, 7-9",
	thur: "",
	fri: "3-5"
}

describe('Fail CRUD Restrictions without login', function() {
	beforeAll(async () => {
		await User.deleteMany({});
		await Restriction.deleteMany({});
	})
	
	it('Create fail', async () => {
		const response = await server.post("/restriction").send(restrictionA_input).expect(302);
		expect(response.header.location).toBe('/login');
		
		const allRestrictions = await Restriction.find({});
		expect(allRestrictions.length).toBe(0);
	})
	it('Read fail', async () => {
		const response = await server.get("/restriction").expect(302);
		expect(response.header.location).toBe('/login');
	})
	it('Update/Delete fail', async () => {
		// Register
		const registerResponse = await server.post("/register").send(userA_signup);
		const user = await User.findOne({username: 'mysnu'});
		const userId = user._id.toString();
		
		// Create a restriction
		await server.post("/restriction").send(restrictionA_input);
		const aRestrictions = await Restriction.find({owner: userId});
		expect(aRestrictions.length).toBe(1);
		const restrictionId = aRestrictions[0]._id.toString();
		const ownerId = aRestrictions[0].owner.toString();
		expect(ownerId).toBe(userId);
		
		// Logout
		await server.get("/logout");
		
		// Try to update restriction
		const updateRestriction = await server.patch(`/restriction/${restrictionId}`).expect(302);
		expect(updateRestriction.header.location).toBe('/login');
		
		// Try to delete restriction
		const deleteResponse = await server.delete(`/restriction/${restrictionId}`).expect(302);
		expect(deleteResponse.header.location).toBe('/login');
	})
})

describe('Success CRUD Restrictions with login', function() {
	beforeAll(async () => {
		await User.deleteMany({});
		await Restriction.deleteMany({});
		
		// Register User A -> Stay logged-in
		await server.post("/register").send(userA_signup);
	});
	it('Create restriction', async () => {
		const response = await server.post("/restriction").send(restrictionA_input).expect(302);
		expect(response.header.location).toBe('/restriction');
	});
	it('Read restrictions', async () => {
		const response = await server.get("/restriction").expect(200);
		expect(response.header.location == '/restriction' || response.header.location == undefined).toBeTruthy();
	});
	it('Update / Delete restrictions', async () => {
		let theRestriction = await Restriction.findOne({});
		const restrictionId = theRestriction._id.toString();
		let response = await server.patch(`/restriction/${restrictionId}`).send({
			restrictionName: "C",
			fri: "4-11"
		}).expect(302);
		
		expect(response.header.location).toBe('/restriction');
		theRestriction = await Restriction.findOne({});
		expect(theRestriction.fri).toEqual([[4, 11]]);
		
		response = await server.delete(`/restriction/${restrictionId}`).expect(302);
		expect(response.header.location).toBe('/restriction');
		theRestriction = await Restriction.findOne({});
		expect(theRestriction).toBe(null);
	})
	
})

describe('Cannot UD Subjects of other users', function() {
	beforeAll(async () => {
		await User.deleteMany({});
		await Restriction.deleteMany({});
		
		// Register User A
		await server.post("/register").send(userA_signup);
		
		// Add a Restriction
		await server.post("/restriction").send(restrictionA_input);
		
		// Logout
		await server.get("/logout");
		
		// Register User B
		await server.post("/register").send(userB_signup);
	});
	it('Attempt Update / Delete', async () => {
		let restrictionOfA = await Restriction.findOne({username: 'mysnu'});
		const restrictionId = restrictionOfA._id.toString();
		
		let response = await server.patch(`/restriction/${restrictionId}`).send({
			restrictionName: "C",
			fri: "4-11"
		}).expect(302);
		
		expect(response.header.location).toBe('/');
		restrictionOfA = await Restriction.findOne({username: 'mysnu'});
		expect(restrictionOfA.restrictionName).toBe('A');
		
		response = await server.delete(`/restriction/${restrictionId}`).expect(302);
		expect(response.header.location).toBe('/');
		restrictionOfA = await Restriction.findOne({username: 'mysnu'});
		expect(restrictionOfA).not.toEqual(undefined);
	});
})