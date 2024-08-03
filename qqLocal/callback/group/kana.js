const Import = require("../../verify.js");

const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

const kuroshiro = new Kuroshiro.default();
kuroshiro.init(new KuromojiAnalyzer());

async function sendKaNa({ qq, groupNo, message, nickName }) {
	if (message.startsWith("/kana-")) {
		try {
			const data = await kuroshiro.convert(message.slice(6), {
				mode: "okurigana",
				to: "hiragana"
			});

			Import.sendGroupMessage(groupNo, [
				{
					type: "Plain",
					text: data
				}
			]);
		} catch (e) {
			console.error(e);
		}
	}
}

Import.groupCallbackList.push(sendKaNa);
