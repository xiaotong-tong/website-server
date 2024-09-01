const express = require("express");
const router = express.Router();

const Verify = require("../model/verify.js");

router.get("/:uid", async (req, res) => {
	try {
		const { uid } = req.params;

		if (!uid) {
			res.status(400).send("缺少参数 uid");
			return;
		}

		const verify = await Verify.findOne(
			{
				attributes: ["id", "name", "password", "avatar", "qqOpenId"],
				where: {
					password: req.params.uid
				}
			},
			{
				raw: true
			}
		);

		if (verify) {
			res.send({
				code: 0,
				data: verify
			});
			return;
		} else {
			res.send({
				code: 1,
				data: "验证失败, 口令错误。"
			});
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

router.put("/edit", async (req, res) => {
	try {
		const { id, name, password, qqOpenId, avatar } = req.body;

		if (!id) {
			res.status(400).send("缺少参数 id");
			return;
		}

		if (!qqOpenId) {
			res.status(400).send("缺少参数 qqOpenId");
			return;
		}

		if (!password) {
			res.status(400).send("缺少参数 password");
			return;
		}

		let item = await Verify.findOne({
			where: {
				id: id,
				qqOpenId: qqOpenId,
				password: password
			}
		});

		if (!item) {
			res.status(400).send("没有找到对应的用户信息。");
			return;
		}

		item = await item.update({
			name: name,
			avatar: avatar
		});

		if (item) {
			res.send(item);
		} else {
			res.status(400).send("验证失败, 口令错误。");
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
