const app = require("./app");
const port = process.env.PORT;

// connect to port
if(process.env.MODE !== "TEST") {
	app.listen(port, () => {
		if (process.env.MODE === "DEV") {
			console.log(`App listening on port ${port}`);
			
			// Get time in ns
			// const hrTime = process.hrtime();
			// console.log(hrTime[0] * 1000000 + hrTime[1] / 1000);
			
			// Get time in ms
			// const loadTimeInMS = Date.now();
			// const performanceNow = require("performance-now");
			// console.log((loadTimeInMS + performanceNow()) * 1000);
		}
	});
}
