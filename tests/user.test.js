const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models/user");

const username = 'mysnu';
const password = 'nodejs1234!';
const email = 'mysnu@snu.ac.kr'

const userA_signup = {
	username,
	password,
	email
}

const userA_login = {
	username,
	password
}

beforeEach(async () => {
	await User.deleteMany({});
    // await request(app).post("/").send(subjectA_input).expect(302);
});

afterEach(async () => {
	await User.deleteMany({});
})

test("Register a user and find it", async () => {
	await request(app).post("/register").send(userA_signup).expect(302); // 'Found'
	const allUsers = await User.find({});
	expect(allUsers.length).toBe(1);
	const user = allUsers[0];
	expect(user.username).toBe(username);
	expect(user.password).not.toBe(password);
	expect(user.email).toBe(email);
})

test("Register as user and logout", async () => {
	await request(app).post("/register").send(userA_signup);
	await request(app).get("/logout").expect(302);
})

test("Login", async () => {
	await request(app).post("/register").send(userA_signup);
	await request(app).get("/logout").expect(302);
	await request(app).get("/login").expect(200);
	await request(app).post("/login").send(userA_login).expect(302);
})