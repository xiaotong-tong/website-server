const Article = require("../../model/article.js");

// 返回文章的 id 和 title 两个字段

const getArticleTitle = async () => {
	try {
		const articles = await Article.findAll({
			attributes: ["id", "title"],
			raw: true
		});

		const articlesMap = new Map();

		articles.forEach((article) => {
			articlesMap.set(article.id, article.title);
		});

		return articlesMap;
	} catch (error) {
		console.error(error);
		return [];
	}
};

module.exports = {
	getArticleTitle
};
