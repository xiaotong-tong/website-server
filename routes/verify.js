const express = require("express");
const router = express.Router();

const Verify = require("../model/verify.js");

router.get("/:uid", async (req, res) => {
	try {
		const verify = await Verify.findOne(
			{
				where: {
					password: req.params.uid
				}
			},
			{
				raw: true
			}
		);

		if (verify) {
			res.send("验证成功");
			return;
		} else {
			res.send("验证失败, 口令错误。");
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
