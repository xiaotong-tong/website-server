const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const Article = sequelize.define(
	"articles",
	{
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
		jaTitle: {
			type: DataTypes.STRING(255),
			comment: "日文标题"
		},
		content: {
			type: DataTypes.TEXT,
			comment: "文章内容"
		},
		jaContent: {
			type: DataTypes.TEXT,
			comment: "日文内容"
		},
		abstract: {
			type: DataTypes.TEXT,
			comment: "文章摘要"
		},
		jaAbstract: {
			type: DataTypes.TEXT,
			comment: "日文摘要"
		},
		author: {
			type: DataTypes.STRING(255),
			comment: "文章作者"
		},
		jaAuthor: {
			type: DataTypes.STRING(255),
			comment: "日文作者"
		},
		// category: {
		// 	type: DataTypes.ENUM,
		// 	// values: ["网络互联", "语言学习", "喵随笔", "test", "其它"],
		// 	values: ["0", "1", "2", "3", "4"],
		// 	comment: "文章分类"
		// },
		category: {
			type: DataTypes.STRING(63),
			comment: "文章分类"
		},
		jaCategory: {
			type: DataTypes.STRING(63),
			comment: "日文文章分类"
		},
		tags: {
			type: DataTypes.STRING(255),
			comment: "文章标签"
		},
		jaTags: {
			type: DataTypes.STRING(255),
			comment: "日文标签"
		},
		createDate: {
			type: DataTypes.DATEONLY,
			comment: "文章创建日期"
		},
		updateDate: {
			type: DataTypes.DATEONLY,
			comment: "文章更新日期"
		},
		thumbnail: {
			type: DataTypes.STRING(255),
			comment: "文章缩略图"
		},
		isDelete: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			comment: "是否已删除"
		},
		onlyLangWith: {
			type: DataTypes.STRING(10),
			defaultValue: "all",
			comment: "是否只在指定语言显示"
		}
	},
	{
		indexes: [
			{
				unique: true,
				fields: ["uid"]
			}
		]
	}
);

// 同步模型到数据库中
Article.sync({ alter: true });

module.exports = Article;
