const express = require("express");
const router = express.Router();

const Kuroshiro = require("kuroshiro");
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

const kuroshiro = new Kuroshiro.default();
kuroshiro.init(new KuromojiAnalyzer());

router.post("/kana/tokana", async (req, res) => {
	try {
		const { message } = req.body;

		if (!message) {
			res.status(400).send("缺少参数 message");
			return;
		}

		const data = await kuroshiro.convert(message, {
			mode: "furigana",
			to: "hiragana"
		});

		res.send(data);
	} catch (error) {
		res.status(500).send(error);
	}
});

const { html } = require("pinyin-pro");

router.post("/pinyin/toPinyin", async (req, res) => {
	try {
		const { message } = req.body;

		if (!message) {
			res.status(400).send("缺少参数 message");
			return;
		}

		const data = html(message);

		res.send(data);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
