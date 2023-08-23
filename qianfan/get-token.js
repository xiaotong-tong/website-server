require("dotenv").config();

const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;

let catchedToken = null;

module.exports = async function () {
	if (catchedToken && catchedToken.expires > Date.now()) {
		return catchedToken.token;
	}

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
			Accept: "application/json"
		}
	});

	const data = await res.json();

	// 缓存token，设置过期时间为 10 天
	catchedToken = {
		token: data.access_token,
		expires: Date.now() + 10 * 24 * 60 * 60 * 1000
	};

	return data.access_token;
};
