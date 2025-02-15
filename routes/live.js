const express = require("express");
const router = express.Router();

const Verify = require("../model/verify.js");
const lives = require("../model/lives.js");

router.get("/list", async (req, res) => {
	try {
		const photosList = await lives.findAll(
			{
				attributes: ["id", "content", "userId", "createTime", "contentType"],
				order: [["id", "DESC"]],
				include: [
					{
						model: Verify,
						attributes: ["name", "avatar", "jpName"]
					}
				],
				where: {
					isDelete: false
				}
			},
			{
				raw: true
			}
		);
		res.send(photosList);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post("/add", async (req, res) => {
	try {
		const userInfo = req.userInfo;

		if (!userInfo) {
			res.status(401).send({
				code: 401,
				msg: "Unauthorized"
			});
			return false;
		}

		const { content, contentType } = req.body;

		if (!content) {
			res.status(400).send({
				code: 400,
				msg: "content is required"
			});
			return false;
		}

		const newLives = await lives.create({
			content,
			userId: userInfo.id,
			contentType
		});

		res.send({
			code: 200,
			data: newLives
		});
		newPhoto = null;
	} catch (error) {
		res.status(500).send({
			code: 500,
			msg: error
		});
	}
});

router.delete("/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deleteLives = await lives.update(
			{
				isDelete: true
			},
			{
				where: {
					id
				}
			}
		);
		res.send(deleteLives);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
