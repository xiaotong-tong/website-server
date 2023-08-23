const getTokens = require("./get-token.js");

const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions`;

const getErnieBotChat = async (message) => {
	const accessToken = await getTokens();

	const res = await fetch(url + "?access_token=" + accessToken, {
		method: "POST",
		body: JSON.stringify({
			messages: [
				{
					role: "user",
					content: message
				}
			]
		}),
		headers: {
			"Content-Type": "application/json; charset=UTF-8"
		}
	});
	const data = await res.json();

	return data;
};

module.exports = getErnieBotChat;
