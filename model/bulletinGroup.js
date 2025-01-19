const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const bulletinGroups = sequelize.define("bulletinGroup", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false,
		comment: "留言贴的 URL"
	},
	width: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		comment: "留言贴宽度"
	},
	height: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		comment: "留言贴高度"
	},
	isDeleted: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		comment: "是否删除"
	}
});

// 同步模型到数据库中
bulletinGroups.sync({ alter: true });

// bulletinGroups.create({
// 	url: "http://192.168.31.156:7777/images/2025/01/19/bulletin-02-full.png",
// 	width: 1200,
// 	height: 672
// });

module.exports = bulletinGroups;
