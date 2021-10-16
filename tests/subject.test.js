const request = require("supertest");
const app = require("../src/app.js");
const server = request.agent(app);
const { User } = require("../src/models/user");
const { Subject } = require("../src/models/subject");



// User A
const username = 'mysnu';
const password = 'nodejs1234!';
const email = 'mysnu@snu.ac.kr';
const userA_signup = { username, password, email };
const userA_login = { username,	password };

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
	
	test('Attempt Creating Subject', async () => {
		await server.post("/").send(subjectA_input).expect(302)
	})
})


describe('View home page after register', function(){
	beforeAll(async () => {
		await User.deleteMany({});
		await Subject.deleteMany({});
	});
	it('Register user A', async () => {
		await server.post("/register").send(userA_signup);
		const allUsers = await User.find({});
		expect(allUsers.length).toBe(1);
	});
    it('View all Subjects', function(done){
    	server.get('/').expect(200)
		.end(function(err, res){
			if (err) return done(err);
			done()
		});
    });
	it('Add a subject', function(done) {
		server.post('/').send(subjectA_input).expect(302)
		.end(async function(err, res) {
			if(err) return done(err);
			const subjects = await Subject.find({});
			console.log(subjects);
			done();
		})
	});
	afterAll(async () => {
		await User.deleteMany({});
		await Subject.deleteMany({});
	})
});