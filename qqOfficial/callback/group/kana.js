const Import = require("../../verify.js");

const KuroshiroFactory = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

const kuroshiro = new KuroshiroFactory.default();
kuroshiro.init(new KuromojiAnalyzer());

async function sendKaNa(d) {
	const content = d.formatContent;
	if (content.startsWith("/假名")) {
		try {
			const input = content.slice(3).trimStart();

			if (!KuroshiroFactory.default.Util.hasKanji(input)) {
				Import.sendGroupMessage(d.group_openid, {
					content: input,
					msg_type: 0,
					msg_id: d.id, // 必填，用来确认是被动回复的标志
					msg_seq: 1
				});

				Import.sendGroupMessage(d.group_openid, {
					content: "呼呼~，涟不费吹灰之力就解决了喵~毕竟涟也是高性能的喵！",
					msg_type: 0,
					msg_id: d.id, // 必填，用来确认是被动回复的标志
					msg_seq: 2
				});
				return;
			}

			const data = await kuroshiro.convert(input, {
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
