const acticle = require("./acticle.js");
const verify = require("./verify.js");
const authenticate = require("./authorization.js");
const word = require("./word.js");
const Comments = require("./comment.js");

const routes = (app) => {
	app.use(authenticate);
	app.use("/acticle", acticle);
	app.use("/verify", verify);
	app.use("/word", word);
	app.use("/comment", Comments);

	app.get("/hello", (req, res) => {
		res.send("Hello World!");
	});
};

module.exports = routes;
