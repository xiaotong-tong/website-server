const acticle = require("./acticle.js");

const routes = (app) => {
	app.use("/acticle", acticle);

	app.get("/hello", (req, res) => {
		res.send("Hello World!");
	});
};

module.exports = routes;
