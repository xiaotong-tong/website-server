const express = require("express");
const router = express.Router();
const { formatDate } = require("xtt-utils");

const Article = require("../model/article.js");

router.post("/add", (req, res) => {
	if (req.passed) {
		try {
			Article.create({
				title: req.body.title,
				content: req.body.content,
				author: req.body.author,
				category: req.body.category,
				abstract: req.body.abstract,
				thumbnail: req.body.thumbnail,
				createDate: formatDate(new Date(), "yyyy-MM-DD")
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

router.get("/list", async (req, res) => {
	try {
		const filters = req.query?.filters;

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
			order: [["id", "DESC"]],
			where: filters?.category
				? {
						category: filters.category
				  }
				: null
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

router.put("/edit/:id", async (req, res) => {
	if (req.passed) {
		try {
			await Article.update(
				{
					title: req.body.title,
					content: req.body.content,
					author: req.body.author,
					category: req.body.category,
					tags: req.body.tags,
					abstract: req.body.abstract,
					thumbnail: req.body.thumbnail
				},
				{
					where: {
						id: req.params.id
					}
				}
			);

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

router.delete("/delete/:id", async (req, res) => {
	if (req.passed) {
		try {
			await Article.destroy({
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
