const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const commentPhotos = sequelize.define("commentPhotos", {
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
	}
});

// 同步模型到数据库中
commentPhotos.sync({ alter: true });

module.exports = commentPhotos;
