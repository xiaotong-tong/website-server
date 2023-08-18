const express = require("express");
const router = express.Router();
const { formatDate } = require("xtt-utils");

const Comments = require("../model/comment.js");
const commentPhotos = require("../model/commentPhoto.js");

router.post("/add", async (req, res) => {
	try {
		const { articleId, content, isGuestbook } = req.body;

		if (!articleId && !isGuestbook) {
			res.status(400).send(`${isGuestbook ? "isGuestbook" : "articleId"} is required`);
			return false;
		}
		if (!content) {
			res.status(400).send("comment content is required");
			return false;
		}

		await Comments.create({
			articleId: articleId,
			isGuestbook: isGuestbook,
			photoUrl: req.body.photoUrl,
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
		let { articleId, isGuestbook } = req.query;

		if (!articleId && !isGuestbook) {
			res.status(400).send(`${isGuestbook ? "isGuestbook" : "articleId"} is required`);
			return false;
		}

		isGuestbook = isGuestbook === "true";

		let comments = await Comments.findAll({
			attributes: [
				"id",
				"uid",
				"articleId",
				"isGuestbook",
				"photoUrl",
				"nickname",
				"email",
				"content",
				"createDate",
				"parent",
				"replyNickName",
				"replyId"
			],
			order: [["id", "ASC"]],
			where: isGuestbook
				? {
						isGuestbook: isGuestbook
				  }
				: {
						articleId: articleId
				  }
		});

		const children = new Map();

		comments = comments
			.filter((comment) => {
				if (comment.parent) {
					const parent = comment.parent;

					if (children.has(parent)) {
						children.get(parent).push(comment);
					} else {
						children.set(parent, [comment]);
					}

					return false;
				} else {
					return true;
				}
			})
			.map((comment) => {
				comment.dataValues.children = children.get(comment.id) || null;
				return comment;
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
			res.status(500).send(error);
		}
	} else {
		res.status(401).send("Unauthorized");
	}
});

router.post("/upload/photo", async (req, res) => {
	try {
		const { url } = req.body;

		if (!url) {
			res.status(400).send("url is required");
			return false;
		}

		await commentPhotos.create({
			url: url
		});

		res.send("success");
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/photo/list", async (req, res) => {
	try {
		const photos = await commentPhotos.findAll({
			attributes: ["id", "url"],
			order: [["id", "ASC"]]
		});
		res.send(photos);
	} catch (error) {
		res.status(500).send(error);
	}
});
module.exports = router;
