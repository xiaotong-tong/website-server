const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const Verify = sequelize.define("verifies", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING(64),
		allowNull: false
	},
	password: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		comment: "验证口令"
	}
});

// 同步模型到数据库中
Verify.sync({ alter: true });

module.exports = Verify;
