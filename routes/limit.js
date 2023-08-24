const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({
	windowMs: 60 * 1000, // 1分钟
	max: 10, // 每分钟最多10请求
	message: "请求过于频繁，请稍后再试"
});

module.exports = chatLimiter;
