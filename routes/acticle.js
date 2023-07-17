const express = require("express");
const router = express.Router();

const Article = require("../model/article.js");

router.post("/add", (req, res) => {
	console.log(req.body);

	// Article.create({
	//     title: req.body.title,
	//     content: req.body.content,
	//     author: req.body.author,
	//     category: req.body.category,
	//     tags: req.body.tags,
	//     createDate: req.body.createDate
	// })

	res.send("Add article successfully!");
});

module.exports = router;
