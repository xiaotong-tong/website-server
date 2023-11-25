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

		let sendMessage;

		if (typeof message === "string") {
			sendMessage = [
				{
					role: "user",
					content: message
				}
			];
		} else if (Array.isArray(message)) {
			sendMessage = message.map((item, index) => {
				if (index % 2 === 0) {
					return {
						role: "user",
						content: item
					};
				} else {
					return {
						role: "assistant",
						content: item
					};
				}
			});
		}

		const data = await getErnieBotChat(sendMessage);

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
