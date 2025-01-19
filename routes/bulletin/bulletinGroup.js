const express = require("express");
const router = express.Router();

const bulletinGroups = require("../../model/bulletinGroup.js");

router.get("/list", async (req, res) => {
	try {
		const datas = await bulletinGroups.findAll(
			{
				attributes: ["id", "url", "width", "height"],
				where: {
					isDeleted: false
				}
			},
			{
				raw: true
			}
		);

		res.send({
			code: 200,
			data: datas
		});
	} catch (error) {
		res.status(500).send({
			code: 500,
			msg: error
		});
	}
});

module.exports = router;
