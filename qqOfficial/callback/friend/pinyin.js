const Import = require("../../verify.js");

const { pinyin } = require("pinyin-pro");

async function sendPinyin(d) {
	const content = d.formatContent;
	if (content.startsWith("/拼音")) {
		try {
			const input = content.slice(3).trimStart();

			const data = pinyin(input, { type: "array" });

			let formatData = "";

			for (let i = 0; i < input.length; i++) {
				if (input[i] === data[i]) {
					formatData += input[i];
				} else {
					formatData += `${input[i]}(${data[i]})`;
				}
			}

			Import.sendFriendMessage(d.author.user_openid, {
				content: formatData,
				msg_type: 0,
				msg_id: d.id, // 必填，用来确认是被动回复的标志
				msg_seq: 1
			});

			Import.sendFriendMessage(d.author.user_openid, {
				content: "呼呼~，涟不费吹灰之力就解决了喵~毕竟涟也是高性能的喵！",
				msg_type: 0,
				msg_id: d.id, // 必填，用来确认是被动回复的标志
				msg_seq: 2
			});
			return;
		} catch (e) {
			console.error(e);
		}
	}
}

Import.friendCallbackList.push(sendPinyin);
