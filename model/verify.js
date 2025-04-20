/*
 * 当前表模型和 https://github.com/xiaotong-tong/qq-bot/blob/main/model/verify.js 一致，如果有修改，必须同步修改
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// 为表定义模型
const Verify = sequelize.define(
	"verifies",
	{
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(64),
			comment: "昵称"
		},
		jpName: {
			type: DataTypes.STRING(64),
			comment: "日文昵称"
		},
		password: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			comment: "验证口令"
		},
		qq: {
			type: DataTypes.STRING(64),
			// allowNull: false,
			comment: "QQ号"
		},
		qqName: {
			type: DataTypes.STRING(64),
			// allowNull: false,
			comment: "QQ昵称"
		},
		qqOpenId: {
			type: DataTypes.STRING(64),
			// allowNull: false,
			comment: "QQ开放ID"
		},
		avatar: {
			type: DataTypes.STRING(255),
			defaultValue: "https://image.xtt.cool/images/mlian2.md.webp",
			comment: "头像 URL"
		},
		isMaster: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			comment: "是否为主人账号"
		}
	},
	{
		// 添加索引
		indexes: [
			{
				unique: true,
				fields: ["password"]
			},
			{
				unique: true,
				fields: ["qqOpenId"]
			}
		]
	}
);

// 同步模型到数据库中
// Verify.sync({ alter: true });

module.exports = Verify;
