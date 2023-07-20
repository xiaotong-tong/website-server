const acticle = require("./acticle.js");
const verify = require("./verify.js");
const authenticate = require("./authorization.js");

const routes = (app) => {
	app.use(authenticate);
	app.use("/acticle", acticle);
	app.use("/verify", verify);

	app.get("/hello", (req, res) => {
		res.send("Hello World!");
	});
};

module.exports = routes;
