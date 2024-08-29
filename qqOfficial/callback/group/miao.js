const Import = require("../../verify.js");
const { replace } = require("xtt-msg");

replace("![变量](nyaLang-->>ω,ꇴ,~,!,\u200d,ก,ฅ,\u200e)");

async function doTextToMiao(d) {
	const content = d.formatContent;
	if (content.startsWith("/喵语")) {
		if (content.length <= 4) {
			Import.sendGroupMessage(d.group_openid, {
				content: "喵喵喵，好像空无一物喵~",
				msg_type: 0,
				msg_id: d.id // 必填，用来确认是被动回复的标志
			});
			return;
		}

		const res = await replace(`![喵语](${content.slice(3).trimStart()})`);

		Import.sendGroupMessage(d.group_openid, {
			content: res,
			msg_type: 0,
			msg_id: d.id // 必填，用来确认是被动回复的标志
		});
	}
}

async function doMiaoToText(d) {
	const content = d.formatContent;
	if (content.startsWith("/解喵语")) {
		if (content.length <= 5) {
			Import.sendGroupMessage(d.group_openid, {
				content: "没有数据，涟也无能为力喵~",
				msg_type: 0,
				msg_id: d.id // 必填，用来确认是被动回复的标志
			});
			return;
		}

		const res = await replace(`![解喵语](${content.slice(4).trimStart()})`);

		Import.sendGroupMessage(d.group_openid, {
			content: res,
			msg_type: 0,
			msg_id: d.id // 必填，用来确认是被动回复的标志
		});
	}
}

Import.groupCallbackList.push(doTextToMiao, doMiaoToText);
