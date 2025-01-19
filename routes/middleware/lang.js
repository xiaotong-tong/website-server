// 处理 headers 中的 lang 字段，如果没有则默认为 zh-CN
async function lang(req, res, next) {
	let lang = req.headers["Accept-Language"];

	if (!lang) {
		lang = "zh-CN";
	}

	req.lang = lang;
	next();
}

module.exports = lang;
