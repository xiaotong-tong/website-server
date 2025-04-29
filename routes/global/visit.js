const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const dayjs = require("../../utils/dateUtil.js");

const Visit = require("../../model/visit.js");

// 获取当前访问是今年第几个访问本网站的人
router.get("/day/number", async (req, res) => {
	try {
		const { token } = req.query;
		const nowDay = dayjs().format("YYYY-MM-DD");
		// 获取今天的访问量
		const visitCount = await Visit.count({
			where: {
				visitDay: nowDay
			}
		});

		// 如果有token,则查询是否有今天的访问记录
		if (token) {
			const oldVisit = await Visit.findOne({
				where: { visitDay: nowDay, token: token }
			});

			if (oldVisit) {
				res.send({
					code: 200,
					data: {
						count: visitCount,
						visitDay: nowDay,
						token: token
					}
				});
				return;
			}
		}

		const visitInfo = await Visit.create();

		res.send({
			code: 200,
			msg: "访问成功",
			data: {
				count: visitCount + 1,
				visitDay: dayjs(visitInfo.visitDay).format("YYYY-MM-DD"),
				visitTime: visitInfo.visitTime,
				token: visitInfo.token
			}
		});
	} catch (error) {
		res.status(500).send({
			code: 500,
			msg: error
		});
	}
});

module.exports = router;
