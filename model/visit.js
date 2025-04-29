const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const visit = sequelize.define("visit", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	visitTime: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
		comment: "访问时间"
	},
	visitDay: {
		type: DataTypes.DATEONLY,
		allowNull: false,
		defaultValue: DataTypes.NOW,
		comment: "访问日期"
	},
	token: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		comment: "访问令牌,用于标识访问者"
	}
});

// 同步模型到数据库中
// visit.sync({ alter: true });

module.exports = visit;
