const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const santi = sequelize.define("santi", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	topic: {
		type: DataTypes.STRING(255),
		allowNull: false,
		comment: "题目"
	},
	content: {
		type: DataTypes.TEXT,
		allowNull: false,
		comment: "动态内容"
	},
	isDelete: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		comment: "是否已删除"
	}
});

// 同步模型到数据库中
santi.sync({ alter: true });

module.exports = santi;
