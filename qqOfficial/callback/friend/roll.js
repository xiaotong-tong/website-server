const Import = require("../../verify.js");
const parseRoll = require("../../../utils/roll.js");

async function doShareRoll(d) {
	const content = d.formatContent;
	if (content.trim().startsWith("/骰娘")) {
		const input = content.slice(3).trimStart();

		const format = parseRoll(input);

		if (format === "" || format === undefined || format === null) {
			Import.sendFriendMessage(d.author.user_openid, {
				content: "无法理解喵~",
				msg_type: 0,
				msg_id: d.id // 必填，用来确认是被动回复的标志
			});
			return;
		}

		Import.sendFriendMessage(d.author.user_openid, {
			content: String(format),
			msg_type: 0,
			msg_id: d.id // 必填，用来确认是被动回复的标志
		});
	}
}

Import.friendCallbackList.push(doShareRoll);
