const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const bulletins = sequelize.define("bulletin", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	type: {
		type: DataTypes.SMALLINT, // 数值型
		allowNull: false,
		comment: "留言贴类型"
	},
	content: {
		type: DataTypes.TEXT,
		allowNull: false,
		comment: "留言内容"
	},
	groupId: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		comment: "该留言贴所属的留言贴组Id"
	},
	x: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		comment: "留言贴 x 坐标"
	},
	y: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		comment: "留言贴 y 坐标"
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
	theme: {
		type: DataTypes.TEXT,
		comment: "留言贴的一些自定义主题设置"
	},
	isDeleted: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		comment: "是否删除"
	}
});

// 同步模型到数据库中
bulletins.sync({ alter: true });

module.exports = bulletins;
