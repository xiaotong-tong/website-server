const express = require("express");
const router = express.Router();
const { formatDate } = require("xtt-utils");

const Comments = require("../model/comment.js");

router.post("/add", async (req, res) => {
	try {
		const { articleId, content } = req.body;

		if (!articleId) {
			res.status(400).send({
				value: "error",
				message: "articleId is required"
			});
			return false;
		}
		if (!content) {
			res.status(400).send({
				value: "error",
				message: "comment content is required"
			});
			return false;
		}

		await Comments.create({
			articleId: articleId,
			nickname: req.body.nickname,
			email: req.body.email,
			content: content,
			createDate: formatDate(new Date(), "yyyy-MM-DD"),
			parent: Number(req.body.parent) || null,
			replyId: Number(req.body.replyId) || null,
			replyNickName: req.body.replyNickName
		});

		res.send("success");
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/list", async (req, res) => {
	try {
		const articleId = req.query?.articleId;

		if (!articleId) {
			res.status(400).send({
				value: "error",
				message: "articleId is required"
			});
			return false;
		}

		const comments = await Comments.findAll({
			attributes: [
				"id",
				"uid",
				"articleId",
				"nickname",
				"email",
				"content",
				"createDate",
				"parent",
				"replyNickName",
				"replyId"
			],
			order: [["id", "ASC"]],
			where: {
				articleId: articleId
			}
		});

		res.send(comments);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.delete("/delete/:id", async (req, res) => {
	if (req.passed) {
		try {
			await Comments.destroy({
				where: {
					id: req.params.id
				}
			});

			res.send("success");
		} catch (error) {
			res.status(500).send({
				value: "error",
				message: error
			});
		}
	} else {
		res.status(401).send({
			value: "error",
			message: "Unauthorized"
		});
	}
});

module.exports = router;
