const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const Article = sequelize.define("articles", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		comment: "Article ID"
	},
	uid: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		unique: "uidIndex",
		comment: "Article UUID"
	},
	title: {
		type: DataTypes.STRING(255),
		comment: "文章标题"
	},
	content: {
		type: DataTypes.TEXT,
		comment: "文章内容"
	},
	abstract: {
		type: DataTypes.TEXT,
		comment: "文章摘要"
	},
	author: {
		type: DataTypes.STRING(255),
		comment: "文章作者"
	},
	category: {
		type: DataTypes.ENUM,
		values: ["网络互联", "日语学习", "喵随笔", "test", "其它"],
		comment: "文章分类"
	},
	tags: {
		type: DataTypes.STRING(255),
		comment: "文章标签"
	},
	createDate: {
		type: DataTypes.DATEONLY,
		comment: "文章创建日期"
	},
	thumbnail: {
		type: DataTypes.STRING(255),
		comment: "文章缩略图"
	}
});

// 同步模型到数据库中
Article.sync({ alter: true });

module.exports = Article;
