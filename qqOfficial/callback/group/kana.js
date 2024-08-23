const Import = require("../../verify.js");

const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

const kuroshiro = new Kuroshiro.default();
kuroshiro.init(new KuromojiAnalyzer());

async function sendKaNa(d) {
	if (d.content.trim().startsWith("/假名")) {
		try {
			const data = await kuroshiro.convert(d.content.trim().slice(3).trim(), {
				mode: "okurigana",
				to: "hiragana"
			});

			Import.sendGroupMessage(d.group_openid, {
				content: data,
				msg_type: 0,
				msg_id: d.id // 必填，用来确认是被动回复的标志
			});
		} catch (e) {
			console.error(e);
		}
	}
}

Import.groupCallbackList.push(sendKaNa);
