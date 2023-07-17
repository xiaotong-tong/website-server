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
		type: DataTypes.STRING(255)
	},
	content: {
		type: DataTypes.TEXT
	},
	author: {
		type: DataTypes.STRING(255)
	},
	category: {
		type: DataTypes.STRING(255)
	},
	tags: {
		type: DataTypes.STRING(255)
	},
	createDate: {
		type: DataTypes.DATEONLY
	}
});

// 同步模型到数据库中
Article.sync({ alter: true });

module.exports = Article;
