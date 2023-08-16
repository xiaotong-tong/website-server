const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const Words = sequelize.define("words", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	word: {
		type: DataTypes.STRING(64),
		allowNull: false,
		comment: "単語"
	},
	kana: {
		type: DataTypes.STRING(64),
		comment: "仮名"
	},
	accent: {
		type: DataTypes.TINYINT.UNSIGNED,
		comment: "重音"
	},
	english: {
		type: DataTypes.STRING(255),
		comment: "英語"
	},
	mean: {
		type: DataTypes.STRING(255),
		comment: "意味"
	},
	read: {
		type: DataTypes.STRING(255),
		comment: "音声"
	}
});

// 同步模型到数据库中
Words.sync({ alter: true });

module.exports = Words;
