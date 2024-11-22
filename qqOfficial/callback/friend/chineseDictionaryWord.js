const Import = require("../../verify.js");
const { Sequelize } = require("sequelize");
const ChineseDictionaryWord = require("../../../model/chineseDictionaryWord.js");

async function doShareChineseDictionaryWordImage(d) {
	if (d.content.trim() === "/三题故事") {
		const words = await ChineseDictionaryWord.findAll({
			attributes: ["id", "word", "explanation"],
			order: Sequelize.literal("RAND()"),
			limit: 3,
			where: {
				isTopic: true
			}
		});

		const content = `这次的三题点心是 “${words[0].word}”、“${words[1].word}” 和 “${words[2].word}” 哦~ 不知能品尝到什么样的味道呢？`;

		Import.sendFriendMessage(d.author.user_openid, {
			content: content,
			msg_type: 0,
			msg_id: d.id // 必填，用来确认是被动回复的标志
		});
	}
}

Import.friendCallbackList.push(doShareChineseDictionaryWordImage);
