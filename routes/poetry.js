const express = require("express");
const router = express.Router();

const poetry300List = require("chinese-poetry/全唐诗/唐诗三百首.json");

const quotesList = require("days-quotes");

router.get("/poetry", async (req, res) => {
	try {
		const key = req.query.key;

		if (!key) {
			res.status(400).send("缺少参数 key");
			return;
		}

		const data = poetry300List?.[key];

		res.send(data);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/quotes", async (req, res) => {
	try {
		const key = req.query.key;

		if (!key) {
			res.status(400).send("缺少参数 key");
			return;
		}
		if (key <= 0) {
			res.status(400).send("key 不能小于 1");
			return;
		}
		if (key > quotesList.quotesCount) {
			res.status(400).send({
				message: "key 超出范围",
				maxKey: quotesList.quotesCount
			});
			return;
		}

		const data = quotesList.list?.[key - 1];

		res.send(data);
	} catch (error) {
		res.status(500).send(error);
	}
});
module.exports = router;
