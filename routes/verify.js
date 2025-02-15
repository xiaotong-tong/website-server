const express = require("express");
const router = express.Router();

const Verify = require("../model/verify.js");

const resMsgMap = {
	zh: {
		noUid: "缺少参数 uid",
		uidFormatError: "参数 uid 格式错误",
		uidNotFound: "验证失败, 口令错误。"
	},
	ja: {
		noUid: "uidが見つかりません",
		uidFormatError: "uidの形式が正しくありません",
		uidNotFound: "検証に失敗しました、パスワードが間違えるかな。"
	}
};
router.get("/:uid", async (req, res) => {
	try {
		const resMsg = resMsgMap[req.lang.startsWith("ja") ? "ja" : "zh"];
		const { uid } = req.params;

		if (!uid) {
			res.status(400).send({
				code: 1,
				msg: resMsg.noUid
			});
			return;
		}

		// 如果 uid 不是 UUID 格式, 则直接返回错误
		if (!/^[0-9a-fA-F-]{36}$/.test(uid)) {
			res.status(400).send({
				code: 2,
				msg: resMsg.uidFormatError
			});
			return;
		}

		const verify = await Verify.findOne(
			{
				attributes: ["id", "name", "jpName", "password", "avatar", "isMaster"],
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
				code: 200,
				data: verify
			});
			return;
		} else {
			res.send({
				code: 3,
				msg: resMsg.uidNotFound,
				data: null
			});
		}
	} catch (error) {
		res.status(500).send({
			code: 500,
			msg: error
		});
	}
});

router.put("/edit", async (req, res) => {
	try {
		const userInfo = req.userInfo;

		const { id, name, password, avatar, jpName } = req.body;

		if (!id) {
			res.status(400).send("缺少参数 id");
			return;
		}

		if (userInfo.id !== id) {
			res.status(401).send({
				code: 401,
				msg: "Unauthorized"
			});
			return false;
		}

		if (!password) {
			res.status(400).send("缺少参数 password");
			return;
		}

		let item = await Verify.findOne({
			where: {
				id: id,
				password: password
			}
		});

		if (!item) {
			res.status(400).send("没有找到对应的用户信息。");
			return;
		}

		item = await item.update({
			name: name,
			jpName: jpName,
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
