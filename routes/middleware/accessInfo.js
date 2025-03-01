const AccessInfo = require("../../model/accessInfo.js");

async function access(req, res, next) {
	AccessInfo.create({
		url: req.originalUrl,
		method: req.method,
		userAgent: req.get("User-Agent"),
		userId: req.userInfo?.id
	});

	next();
}

module.exports = access;
