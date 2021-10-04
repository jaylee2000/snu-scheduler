// const add = (a, b) => {
// 	return new Promise((resolve, reject) => {
// 		setTimeout( () => {
// 			if ( a < 0 || b < 0) {
// 				return reject('Numbers must be nonnegative')
// 			}
// 			resolve(a+b)
// 		}, 2000)
// 	})
// }

// test('Hello world!', () => {
	
// })

// test('This should fail', () => {
// 	throw new Error('Failure!')
// })

// test('Async test demo', (done) => {
// 	setTimeout( () => {
// 		expect(1).toBe(1)
// 		done()
// 	}, 2000)
// })

// test('Promise test demo', (done) => {
// 	add(2, 3)
// 		.then( (sum) => {
// 			expect(sum).toBe(5)
// 			done()
// 		})
// })

// test('Async/Await test demo', async () => {
// 	const sum = await add(10, 22);
// 	expect(sum).toBe(32)
// })

const request = require('supertest')
const app = require('../src/app')
test('Should signup a new user', async () => {
	await request(app).get('/').send({
	}).expect(200)
})