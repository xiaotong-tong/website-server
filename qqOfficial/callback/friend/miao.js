const Import = require("../../verify.js");
const { replace } = require("xtt-msg");

async function doToMiao(d) {
	if (d.content.trim().startsWith("/喵语")) {
		const qq = d.author.user_openid;

		const content = await replace(`![喵语](${d.content.trim().slice(3).trim()})`);

		Import.sendFriendMessage(qq, {
			content: content,
			msg_type: 0,
			msg_id: d.id // 必填，用来确认是被动回复的标志
		});
	}
}

Import.friendCallbackList.push(doToMiao);
