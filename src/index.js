const app = require("./app");
const port = process.env.PORT;

// connect to port
if(process.env.MODE !== "TEST") {
	app.listen(port, () => {
		if (process.env.MODE === "DEV") {
			console.log(`App listening on port ${port}`);
		}
	});
}
