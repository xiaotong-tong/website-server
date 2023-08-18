const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const Comments = sequelize.define("comments", {
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	uid: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		unique: "uidIndex"
	},
	articleId: {
		type: DataTypes.BIGINT.UNSIGNED,
		comment: "评论的文章ID"
	},
	isGuestbook: {
		type: DataTypes.BOOLEAN,
		comment: "是否是留言"
	},
	photoUrl: {
		type: DataTypes.STRING(255),
		comment: "评论者头像链接"
	},
	nickname: {
		type: DataTypes.STRING(255),
		comment: "评论者昵称"
	},
	email: {
		type: DataTypes.STRING(255),
		comment: "评论者邮箱"
	},
	content: {
		type: DataTypes.TEXT,
		comment: "评论内容"
	},
	createDate: {
		type: DataTypes.DATEONLY,
		comment: "评论创建日期"
	},
	parent: {
		type: DataTypes.BIGINT.UNSIGNED,
		comment: "父评论ID"
	},
	replyNickName: {
		type: DataTypes.STRING(255),
		comment: "回复的昵称"
	},
	replyId: {
		type: DataTypes.BIGINT.UNSIGNED,
		comment: "回复的评论ID"
	}
});

// 同步模型到数据库中
Comments.sync({ alter: true });

module.exports = Comments;
