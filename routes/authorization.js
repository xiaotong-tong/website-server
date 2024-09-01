const Verify = require("../model/verify.js");

// 验证口令, 如果通过则设置 req.passed 为 true, 否则为 false

async function authenticate(req, res, next) {
	const key = req.headers.authorization;

	if (key) {
		const verify = await Verify.findOne(
			{
				where: {
					password: key
				}
			},
			{
				raw: true
			}
		);

		if (verify) {
			req.passed = true;
			next();
			return;
		}
	}

	req.passed = false;
	next();
}

module.exports = authenticate;
