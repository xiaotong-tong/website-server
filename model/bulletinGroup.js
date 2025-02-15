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
// 	url: "https://image.xtt.moe/local/images/2025/02/12/bulletin-04-full.png",
// 	width: 1920,
// 	height: 1080
// });

module.exports = bulletinGroups;
