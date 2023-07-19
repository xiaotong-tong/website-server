const express = require("express");
const router = express.Router();
const { formatDate } = require("xtt-utils");

const Article = require("../model/article.js");

router.post("/add", (req, res) => {
	try {
		Article.create({
			title: req.body.title,
			content: req.body.content,
			author: req.body.author,
			category: req.body.category,
			tags: req.body.tags,
			createDate: formatDate(new Date(), "yyyy-MM-DD")
		});

		res.send("success");
	} catch (error) {
		res.status(500).send({
			value: "error",
			message: error
		});
	}
});

router.get("/list", async (req, res) => {
	try {
		const articles = await Article.findAll({
			attributes: [
				"id",
				"uid",
				"title",
				"content",
				"author",
				"category",
				"tags",
				"createDate",
				"thumbnail",
				"abstract"
			],
			order: [["id", "DESC"]]
		});

		res.send({
			value: "success",
			data: articles
		});
	} catch (error) {
		res.status(500).send({
			value: "error",
			message: error
		});
	}
});

router.get("/:id", async (req, res) => {
	try {
		const article = await Article.findOne({
			where: {
				id: req.params.id
			},
			attributes: ["id", "uid", "title", "content", "author", "category", "tags", "createDate", "thumbnail", "abstract"]
		});

		res.send({
			value: "success",
			data: article
		});
	} catch (error) {
		res.status(500).send({
			value: "error",
			message: error
		});
	}
});

module.exports = router;
