const Import = require("../../verify.js");
const { random } = require("xtt-utils");
const { topic } = require("days-quotes");

async function doShareChineseDictionaryWordImage(d) {
	if (d.content.trim() === "/三题故事") {
		// 随机获取三项
		const cnWords = [];
		const jpWords = [];
		cnWords.push(
			topic.cn.list[random(0, topic.cn.count)],
			topic.cn.list[random(0, topic.cn.count)],
			topic.cn.list[random(0, topic.cn.count)]
		);
		jpWords.push(
			topic.jp.list[random(0, topic.jp.count)],
			topic.jp.list[random(0, topic.jp.count)],
			topic.jp.list[random(0, topic.jp.count)]
		);

		const content = `这次的三题点心是 “${cnWords[0].word}”、“${cnWords[1].word}” 和 “${cnWords[2].word}” 哦~ 不知能品尝到什么样的味道呢？\nもし日本語でやれば、「${jpWords[0].word}」、「${jpWords[1].word}」と「${jpWords[2].word}」はどうでしょうか、どんな美味しいものを書けますか。`;

		Import.sendFriendMessage(d.author.user_openid, {
			content: content,
			msg_type: 0,
			msg_id: d.id // 必填，用来确认是被动回复的标志
		});
	}
}

Import.friendCallbackList.push(doShareChineseDictionaryWordImage);
