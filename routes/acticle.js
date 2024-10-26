const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const { formatDate } = require("xtt-utils");

// xss 过滤
// 文章好像不需要过滤，目前文章方面由我自己控制，写入等也需要有写入权限。
// const xss = require("xss");

const Article = require("../model/article.js");

router.post("/add", async (req, res) => {
	if (req.passed) {
		try {
			let { content } = req.body;

			// content = xss(content);

			await Article.create({
				title: req.body.title,
				content: content,
				author: req.body.author,
				category: req.body.category,
				tags: req.body.tags,
				abstract: req.body.abstract,
				thumbnail: req.body.thumbnail,
				createDate: formatDate(new Date(), "yyyy-MM-DD"),
				jaTitle: req.body.jaTitle,
				jaContent: req.body.jaContent,
				jaAuthor: req.body.jaAuthor,
				jaAbstract: req.body.jaAbstract,
				jaTags: req.body.jaTags,
				jaCategory: req.body.jaCategory
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
		const { category, withOutContent, lang } = req.query;

		let where = {
			isDelete: false,
			[Op.or]: [{ onlyLangWith: null }, { onlyLangWith: "all" }, { onlyLangWith: lang }]
		};

		if (category) {
			where.category = category;
		}

		const attrs = [
			"id",
			"uid",
			"title",
			"author",
			"category",
			"tags",
			"createDate",
			"updateDate",
			"thumbnail",
			"abstract",
			"jaTitle",
			"jaAuthor",
			"jaAbstract",
			"jaTags",
			"jaCategory"
		];

		if (!withOutContent) {
			attrs.push("content", "jaContent");
		}

		const articles = await Article.findAll({
			attributes: attrs,
			order: [["id", "DESC"]],
			where: where
		});

		res.send(articles);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { lang } = req.query;

		let attrs = [];

		if (lang === "ja") {
			attrs = [
				"id",
				"uid",
				["jaTitle", "title"],
				["jaContent", "content"],
				["jaAuthor", "author"],
				["jaCategory", "category"],
				["jaTags", "tags"],
				"createDate",
				"updateDate",
				"thumbnail",
				["jaAbstract", "abstract"]
			];
		} else {
			attrs = [
				"id",
				"uid",
				"title",
				"content",
				"author",
				"category",
				"tags",
				"createDate",
				"updateDate",
				"thumbnail",
				"abstract"
			];
		}

		const article = await Article.findOne(
			{
				where: {
					id: req.params.id,
					isDelete: false
				},
				attributes: attrs
			},
			{
				raw: true
			}
		);

		// 如果 article 不存在，这代表文章不存在，返回 404
		if (!article) {
			res.status(404).send("Not Found Article ID");
			return;
		}

		// 获取上一篇文章的信息
		const prevArticle = await Article.findOne({
			where: {
				id: {
					[Op.lt]: req.params.id
				},
				isDelete: false
			},
			order: [["id", "DESC"]],
			attributes: ["id", "uid", "title", "jaTitle"]
		});

		// 获取下一篇文章的信息
		const nextArticle = await Article.findOne({
			where: {
				id: {
					[Op.gt]: req.params.id
				},
				isDelete: false
			},
			order: [["id", "ASC"]],
			attributes: ["id", "uid", "title", "jaTitle"]
		});

		article.dataValues.prev = prevArticle;
		article.dataValues.next = nextArticle;

		res.send(article);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.put("/edit/:id", async (req, res) => {
	if (req.passed) {
		try {
			const updateOption = {
				updateDate: formatDate(new Date(), "yyyy-MM-DD")
			};

			if (req.body.title) {
				updateOption.title = req.body.title;
			}
			if (req.body.content) {
				// updateOption.content = xss(req.body.content);
				updateOption.content = req.body.content;
			}
			if (req.body.author) {
				updateOption.author = req.body.author;
			}
			if (req.body.category) {
				updateOption.category = req.body.category;
			}
			if (req.body.tags) {
				updateOption.tags = req.body.tags;
			}
			if (req.body.abstract) {
				updateOption.abstract = req.body.abstract;
			}
			if (req.body.thumbnail) {
				updateOption.thumbnail = req.body.thumbnail;
			}
			if (req.body.jaTitle) {
				updateOption.jaTitle = req.body.jaTitle;
			}
			if (req.body.jaContent) {
				updateOption.jaContent = req.body.jaContent;
			}
			if (req.body.jaAuthor) {
				updateOption.jaAuthor = req.body.jaAuthor;
			}
			if (req.body.jaAbstract) {
				updateOption.jaAbstract = req.body.jaAbstract;
			}
			if (req.body.jaTags) {
				updateOption.jaTags = req.body.jaTags;
			}
			if (req.body.jaCategory) {
				updateOption.jaCategory = req.body.jaCategory;
			}

			await Article.update(updateOption, {
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

router.delete("/delete/:id", async (req, res) => {
	if (req.passed) {
		try {
			// 删除文章
			await Article.update(
				{
					isDelete: true
				},
				{
					where: {
						id: req.params.id
					}
				}
			);

			res.send("success");
		} catch (error) {
			res.status(500).send(error);
		}
	} else {
		res.status(401).send("Unauthorized");
	}
});

router.get("/category/list", async (req, res) => {
	try {
		let categories = await Article.findAll({
			attributes: ["category"],
			group: ["category"]
		});

		categories = categories.map((item) => item.category);

		res.send(categories);
	} catch (error) {
		res.status(500).send;
	}
});

router.get("/category/jaList", async (req, res) => {
	try {
		let categories = await Article.findAll({
			attributes: ["jaCategory"],
			group: ["jaCategory"]
		});

		categories = categories.map((item) => item.jaCategory);

		res.send(categories);
	} catch (error) {
		res.status(500).send;
	}
});

module.exports = router;
