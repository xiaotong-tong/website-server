const acticle = require("./acticle.js");
const verify = require("./verify.js");
const authenticate = require("./authorization.js");
const word = require("./word.js");
const Comments = require("./comment.js");
const Chat = require("./chat.js");
const Ruby = require("./ruby.js");
const Poetry = require("./poetry.js");
const UploadImage = require("./oss/uploadImage.js");
const Photots = require("./photos/photos.js");
const Live = require("./live.js");

const chatLimiter = require("./limit.js");

const routes = (app) => {
	app.use("/chat/bot", chatLimiter);

	app.use(authenticate);

	app.use("/acticle", acticle);
	app.use("/verify", verify);
	app.use("/word", word);
	app.use("/comment", Comments);
	app.use("/chat", Chat);
	app.use("/ruby", Ruby);
	app.use("/oss/image", UploadImage);
	app.use("/days", Poetry);
	app.use("/lives", Live);

	app.use("/photos", Photots);

	app.get("/hello", (req, res) => {
		res.send("Hello World!");
	});

	require("./widget.js")(app);
};

module.exports = routes;
