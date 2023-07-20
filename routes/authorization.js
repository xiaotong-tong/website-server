const Verify = require("../model/verify.js");

// 验证口令, 如果通过则设置 req.passed 为 true, 否则为 false

async function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;

	if (authHeader?.startsWith("Bearer ")) {
		const verify = await Verify.findOne({
			where: {
				name: "master"
			}
		});

		if (authHeader.slice(7) === verify.password) {
			req.passed = true;
			next();
			return;
		}
	}

	req.passed = false;
	next();
}

module.exports = authenticate;
