require("dotenv").config();
const { Sequelize } = require("sequelize");

// 连接数据库
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	dialect: "mysql",
	zone: "+08:00"
});

// 测试连接是否成功
try {
	(async () => {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	})();
} catch (error) {
	console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
