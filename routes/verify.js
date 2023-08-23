const express = require("express");
const router = express.Router();

const Verify = require("../model/verify.js");

// 初始话创建一个名为 master 的验证口令
// Verify.create({
// 	name: "master"
// });

router.get("/:uid", async (req, res) => {
	try {
		const verify = await Verify.findOne({
			where: {
				name: "master"
			}
		});

		if (req.params.uid === verify.password) {
			res.send("验证成功");
		} else {
			res.send("验证失败, 口令错误。");
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
