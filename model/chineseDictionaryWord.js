const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const ChineseDictionaryWord = sequelize.define("chineseDictionaryWords", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	word: {
		type: DataTypes.STRING(64),
		allowNull: false,
		comment: "单词"
	},
	pinyin: {
		type: DataTypes.STRING(64),
		comment: "拼音"
	},
	abbr: {
		type: DataTypes.STRING(64),
		comment: "缩写"
	},
	explanation: {
		type: DataTypes.TEXT,
		comment: "解释"
	},
	isTopic: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		comment: "是否加入三题故事"
	}
});

// 同步模型到数据库中
ChineseDictionaryWord.sync({ alter: true });

module.exports = ChineseDictionaryWord;
