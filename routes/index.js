const acticle = require("./acticle.js");
const verify = require("./verify.js");
const authenticate = require("./authorization.js");
const word = require("./word.js");
const Comments = require("./comment.js");
const Chat = require("./chat.js");
const Kana = require("./kana.js");
const UploadImage = require("./oss/uploadImage.js");

const chatLimiter = require("./limit.js");

const routes = (app) => {
	app.use("/chat/bot", chatLimiter);

	app.use(authenticate);

	app.use("/acticle", acticle);
	app.use("/verify", verify);
	app.use("/word", word);
	app.use("/comment", Comments);
	app.use("/chat", Chat);
	app.use("/kana", Kana);
	app.use("/oss/image", UploadImage);

	app.get("/hello", (req, res) => {
		res.send("Hello World!");
	});

	require("./widget.js")(app);
};

module.exports = routes;
