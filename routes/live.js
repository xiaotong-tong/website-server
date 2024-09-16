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
						attributes: ["name", "avatar"]
					}
				]
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
		const { content, userId, contentType } = req.body;

		if (!content) {
			res.status(400).send("content is required");
			return false;
		}
		if (!userId) {
			res.status(400).send("userId is required");
			return false;
		}

		const newLives = await lives.create({
			content,
			userId,
			contentType
		});

		res.send(newLives);
		newPhoto = null;
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
