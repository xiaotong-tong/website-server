const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const accessInfo = sequelize.define("accessInfo", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	url: {
		type: DataTypes.STRING(64),
		allowNull: false,
		comment: "访问的URL"
	},
	method: {
		type: DataTypes.STRING(10),
		allowNull: false,
		comment: "请求方法"
	},
	userAgent: {
		type: DataTypes.STRING(255),
		allowNull: false,
		comment: "用户代理信息"
	},
	userId: {
		type: DataTypes.BIGINT.UNSIGNED,
		comment: "用户ID"
	},
	createTime: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
		comment: "访问时间"
	},
	isDelete: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		comment: "是否已删除"
	}
});

// 同步模型到数据库中
// accessInfo.sync({ alter: true });

module.exports = accessInfo;
