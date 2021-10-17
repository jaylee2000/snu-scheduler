const request = require("supertest");
const app = require("../src/app.js");
const server = request.agent(app);

// Models
const { User } = require("../src/models/user");
const { Subject } = require("../src/models/subject");
const { ProvidedSubject } = require("../src/models/providedSubject");
const { Restriction } = require("../src/models/restriction");
const { MustTakeGroup } = require("../src/models/mustTakeGroup");

// Function
const { calculateMaxIntervalSum } = require("../src/functions/intervalScheduling");

// User A
const username_A = 'mysnu';
const password_A = 'nodejs1234!';
const email_A = 'mysnu@snu.ac.kr';
const userA_signup = { username: username_A, password: password_A, email: email_A };
const userA_login = { username: username_A, password: password_A };

// User B
const username_B = 'myyonsei';
const password_B = 'nodejs5678!';
const email_B = 'myyonsei@yonsei.ac.kr';
const userB_signup = { username: username_B, password: password_B, email: email_B };
const userB_login = { username: username_B, password: password_B };

// Subject A
const subjectA_input = {
	subjectName: "A",
	mon: "2-4",
	weight: "3",
	credit: 1,
};

// Subject B
const subjectB_input = {
	subjectName: "B",
	tue: "2-4",
	weight: "4",
	credit: 2,
}

// Restriction A
const restrictionA_input = {
	restrictionName: "A",
	tue: "2-4",
	fri: "3-5"
}

// Restriction B
const restrictionB_input = {
	restrictionName: "B",
	mon: "2-4, 7-9"
}

describe("Two Users", function () {
	beforeAll(async () => {
		await Restriction.deleteMany({});
		await MustTakeGroup.deleteMany({});
	});
	beforeEach(async () => {
		await User.deleteMany({});
		await Subject.deleteMany({});
	});
	
	test("User B's best schedule doesn't contain A's subject", async () => {
		await server.post("/register").send(userA_signup);
		await server.post("/subject").send(subjectA_input);
		await server.get("/logout");
		
		await server.post("/register").send(userB_signup);
		
		const userB = await User.findOne({username: username_B});
		const userB_id = userB._id.toString();
		
		const maxCredit = 30;
		
		const bestSchedule_B = await calculateMaxIntervalSum(maxCredit, userB_id);
		expect(bestSchedule_B.length).toBe(0);
	});
	
	test("User B's best schedule doesn't refer to A's restriction", async () => {
		await server.post("/register").send(userA_signup);
		await server.post("/subject").send(subjectA_input);
		await server.post("/restriction").send(restrictionA_input);
		await server.get("/logout");
		
		await server.post("/register").send(userB_signup);
		await server.post("/subject").send(subjectB_input);
		await server.post("/restriction").send(restrictionB_input);
		
		const userA = await User.findOne({username: username_A});
		const userA_id = userA._id.toString();
		const userB = await User.findOne({username: username_B});
		const userB_id = userB._id.toString();
		
		const maxCredit = 30;
		
		const bestSchedule_A = await calculateMaxIntervalSum(maxCredit, userA_id);
		expect(bestSchedule_A.length).toBe(1);
		const bestSchedule_B = await calculateMaxIntervalSum(maxCredit, userB_id);
		expect(bestSchedule_B.length).toBe(1);
	});
	
	test("User B's best schedule doesn't refer to A's mustTakeGroup", async () => {
		
	})
	
})