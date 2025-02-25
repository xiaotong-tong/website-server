// 导入中间件处理
const authenticate = require("./middleware/authorization.js");
const chatLimiter = require("./middleware/limit.js");
const lang = require("./middleware/lang.js");
const accessInfo = require("./middleware/accessInfo.js");

// 导入路由处理
const acticle = require("./acticle.js");
const verify = require("./verify.js");
const word = require("./word.js");
const Comments = require("./comment.js");
const Chat = require("./chat.js");
const Ruby = require("./ruby.js");
const Poetry = require("./poetry.js");
const UploadImage = require("./oss/uploadImage.js");
const Photots = require("./photos/photos.js");
const Live = require("./live.js");
const ChineseDictionaryWord = require("./chineseDictionaryWord.js");
const Bulletins = require("./bulletin/bulletin.js");
const BulletinsGroup = require("./bulletin/bulletinGroup.js");
const Santi = require("./santi.js");

const routes = (app) => {
	// 使用中间件
	app.use("/chat/bot", chatLimiter);
	app.use(authenticate);
	app.use(lang);
	app.use(accessInfo);

	// 使用路由
	app.use("/acticle", acticle);
	app.use("/verify", verify);
	app.use("/word", word);
	app.use("/comment", Comments);
	app.use("/chat", Chat);
	app.use("/ruby", Ruby);
	app.use("/oss/image", UploadImage);
	app.use("/days", Poetry);
	app.use("/lives", Live);
	app.use("/chineseDictionaryWord", ChineseDictionaryWord);
	app.use("/bulletin", Bulletins);
	app.use("/bulletinGroup", BulletinsGroup);
	app.use("/santi", Santi);

	app.use("/photos", Photots);

	// 测试路由
	app.get("/hello", (req, res) => {
		res.send("Hello World!");
	});

	require("./widget.js")(app);
};

module.exports = routes;
