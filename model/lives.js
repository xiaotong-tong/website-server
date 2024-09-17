const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Verify = require("./verify.js");

// 为表定义模型
const lives = sequelize.define("lives", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	content: {
		type: DataTypes.TEXT,
		allowNull: false,
		comment: "动态内容"
	},
	userId: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		comment: "用户ID"
	},
	createTime: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
		comment: "创建时间"
	},
	contentType: {
		type: DataTypes.STRING(10),
		allowNull: false,
		defaultValue: "text",
		comment: "内容类型"
	},
	isDelete: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		comment: "是否已删除"
	}
});

lives.belongsTo(Verify, {
	foreignKey: "userId",
	targetKey: "id"
});

// 同步模型到数据库中
lives.sync({ alter: true });

module.exports = lives;
