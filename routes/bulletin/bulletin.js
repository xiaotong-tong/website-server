const express = require("express");
const router = express.Router();

const Bulletins = require("../../model/bulletin.js");

router.get("/list", async (req, res) => {
	try {
		const { groupId } = req.query;

		if (!groupId) {
			res.status(400).send("缺少参数 groupId");
			return;
		}

		const datas = await Bulletins.findAll(
			{
				attributes: ["id", "type", "content", "x", "y", "width", "height", "theme"],
				where: {
					isDeleted: false,
					groupId: groupId
				}
			},
			{
				raw: true
			}
		);

		// 将 theme 字段 从 JSON 字符串转换为 JSON 对象
		datas.forEach((item) => {
			item.theme = JSON.parse(item.theme);
		});

		res.send(datas);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post("/add", async (req, res) => {
	try {
		const { type, content, x, y, width, height, theme, groupId } = req.body;

		if (!type) {
			res.status(400).send("缺少参数 type");
			return;
		}

		if (!content) {
			res.status(400).send("缺少参数 content");
			return;
		}

		if (!groupId) {
			res.status(400).send("缺少参数 groupId");
			return;
		}

		if (!x) {
			res.status(400).send("缺少参数 x");
			return;
		}

		if (!y) {
			res.status(400).send("缺少参数 y");
			return;
		}

		if (!width) {
			res.status(400).send("缺少参数 width");
			return;
		}

		if (!height) {
			res.status(400).send("缺少参数 height");
			return;
		}

		const item = await Bulletins.create({
			type: type,
			content: content,
			x: x,
			y: y,
			width: width,
			height: height,
			theme: JSON.stringify(theme),
			groupId: groupId
		});

		res.send(item);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
