const express = require("express");
const router = express.Router();

const getErnieBotChat = require("../qianfan/ernie-bot.js");

router.post("/bot", async (req, res) => {
	try {
		const { message } = req.body;

		if (!message) {
			res.status(400).send("缺少参数 message");
			return;
		}

		const data = await getErnieBotChat(message);

		if (data.error_code) {
			res.status(500).send(data);
			return;
		}

		res.send(data.result);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
