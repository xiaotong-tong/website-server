const express = require("express");
const router = express.Router();

const poetry300List = require("chinese-poetry/全唐诗/唐诗三百首.json");

const quotesList = require("days-quotes");

router.get("/poetry", async (req, res) => {
	try {
		let key = req.query.key;

		if (!key) {
			res.status(400).send("缺少参数 key");
			return;
		}
		key = parseInt(key);

		if (Number.isNaN(key)) {
			res.status(400).send("key 需要是整数类型, 但是传入的是 " + key);
			return;
		}

		if (key <= 0) {
			res.status(400).send("key 不能小于 1");
			return;
		}

		res.send(poetry300List?.[key]);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/quotes", async (req, res) => {
	try {
		let key = req.query.key;

		if (!key) {
			res.status(400).send("缺少参数 key");
			return;
		}
		key = parseInt(key);

		if (Number.isNaN(key)) {
			res.status(400).send("key 需要是整数类型, 但是传入的是 " + key);
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

		res.send(quotesList.list?.[key - 1]);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/quotes/list", async (req, res) => {
	try {
		res.send(quotesList.list);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/poetry/self", async (req, res) => {
	try {
		res.send(quotesList.poetryList);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
