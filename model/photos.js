const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const photos = sequelize.define("photos", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	url: {
		type: DataTypes.STRING(255),
		allowNull: false,
		comment: "图片地址"
	},
	botUse: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		comment: "是否是 bot 使用图片"
	}
});

// 同步模型到数据库中
photos.sync({ alter: true });

module.exports = photos;
