require("dotenv").config();
const WebSocket = require("ws");

const domain = process.env.sandbox ? "https://sandbox.api.sgroup.qq.com" : "https://api.sgroup.qq.com";

let accessToken;
let ws;
let seq;
let heartbeatInterval;

const groupCallbackList = [];
const friendCallbackList = [];

async function connectWS(url) {
	console.log("Connecting to WebSocket", url);
	ws = new WebSocket(url);

	ws.on("open", function open() {
		console.log("connected");
	});

	ws.on("close", function close() {
		console.log("disconnected");
		connectWS(url);
	});

	ws.on("message", async function incoming(data) {
		if (Buffer.isBuffer(data)) {
			const str = data.toString("utf-8");
			// console.log("str", str);
			const parsedJson = JSON.parse(str);

			// 成功创建连接，心跳包
			if (parsedJson.op === 10) {
				// 获取心跳周期
				heartbeatInterval = parsedJson.d.heartbeat_interval;

				// 鉴权
				const response = {
					op: 2,
					d: {
						token: `QQBot ${accessToken}`,
						intents: (1 << 30) | (1 << 0) | (1 << 1) | (1 << 25),
						shard: [0, 1],
						properties: {
							os: "linux",
							browser: "my_library",
							device: "my_library"
						}
					}
				};

				ws.send(JSON.stringify(response));
			} else if (parsedJson.op === 0 && parsedJson.t === "READY") {
				// 鉴权成功
				seq = parsedJson.s;
				sessionID = parsedJson.d.session_id;

				// 发送心跳包
				const response = {
					op: 1,
					d: seq
				};
				ws.send(JSON.stringify(response));
			} else if (parsedJson.op === 11) {
				// 收到心跳回应
				setTimeout(() => {
					const response = {
						op: 1,
						d: seq
					};
					ws.send(JSON.stringify(response));
				}, heartbeatInterval);
			} else if (parsedJson.op === 0 && parsedJson.t === "GROUP_AT_MESSAGE_CREATE") {
				seq = parsedJson.s;
				groupCallbackList?.forEach((callback) => {
					try {
						parsedJson.d.formatContent = parsedJson.d.content.trimStart();
						callback(parsedJson.d);
					} catch (err) {
						// 捕获错误，防止一个 callback 出错导致其他 callback 无法执行
						console.error("Error in group callback:", err);
					}
				});
			} else if (parsedJson.op === 0 && parsedJson.t === "C2C_MESSAGE_CREATE") {
				seq = parsedJson.s;
				friendCallbackList?.forEach((callback) => {
					try {
						parsedJson.d.formatContent = parsedJson.d.content.trimStart();
						callback(parsedJson.d);
					} catch (err) {
						// 捕获错误，防止一个 callback 出错导致其他 callback 无法执行
						console.error("Error in friend callback:", err);
					}
				});
			}
		}
	});

	ws.on("error", function error(err) {
		console.error("WebSocket error:", err);
	});
}

async function getAppAccessToken() {
	const qqUrl = "https://bots.qq.com/app/getAppAccessToken";
	try {
		const response = await fetch(qqUrl, {
			method: "POST",
			body: JSON.stringify({
				appId: process.env.QQ_BOT_ID,
				clientSecret: process.env.QQ_BOT_SECRET
			}),
			headers: {
				"Content-Type": "application/json"
			}
		});
		const data = await response.json();
		accessToken = data.access_token;

		setTimeout(getAppAccessToken, data.expires_in * 1000);
		return data.accessToken;
	} catch (err) {
		console.error("Error in getAppAccessToken:", err);
	}
}

async function getUrl() {
	await getAppAccessToken();

	const qqUrl = domain + "/gateway";

	try {
		const response = await fetch(qqUrl, {
			method: "GET",
			headers: {
				// Authorization: `Bot ${process.env.QQ_BOT_ID}.${process.env.QQ_BOT_TOKEN}`
				Authorization: `QQBot ${accessToken}`
			}
		});

		if (response.status === 401) {
			// 认证失败， 十分钟后重试
			setTimeout(getUrl, 600000);
			return;
		} else if (response.status === 200) {
			const data = await response.json();

			connectWS(data.url);
		}
	} catch (err) {
		console.error("Error in getUrl:", err);
	}
}
getUrl();

async function sendGroupMessage(target, messageChain) {
	if (!target) {
		console.error("No target specified");
		return;
	}

	let qqUrl = `${domain}/v2/groups/${target}/messages`;

	if (messageChain.type === 1) {
		const mediaUrl = `${domain}/v2/groups/${target}/files`;

		const response = await fetch(mediaUrl, {
			method: "POST",
			headers: {
				Authorization: `QQBot ${accessToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(messageChain)
		});
		const data = await response.json();
		messageChain = {
			msg_type: 7,
			media: data,
			msg_id: messageChain.msg_id
		};
	}

	const response = await fetch(qqUrl, {
		method: "POST",
		headers: {
			Authorization: `QQBot ${accessToken}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(messageChain)
	});

	const data = await response.json();

	return data;
}

async function sendFriendMessage(target, messageChain) {
	if (!target) {
		console.error("No target specified");
		return;
	}

	let qqUrl = `${domain}/v2/users/${target}/messages`;

	if (messageChain.type === 1) {
		const mediaUrl = `${domain}/v2/users/${target}/files`;

		const response = await fetch(mediaUrl, {
			method: "POST",
			headers: {
				Authorization: `QQBot ${accessToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(messageChain)
		});
		const data = await response.json();
		messageChain = {
			msg_type: 7,
			media: data,
			msg_id: messageChain.msg_id
		};
	}

	const response = await fetch(qqUrl, {
		method: "POST",
		headers: {
			Authorization: `QQBot ${accessToken}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(messageChain)
	});

	const data = await response.json();

	return data;
}

module.exports = {
	ws,
	sendGroupMessage,
	sendFriendMessage,
	groupCallbackList,
	friendCallbackList
};

// 导入 callback 模块
// 群聊回调列表
require("./callback/group/qrcode.js");
require("./callback/group/encodeQrcode.js");
require("./callback/group/days.js");
require("./callback/group/kana.js");
require("./callback/group/miao.js");
require("./callback/group/roll.js");
require("./callback/group/pinyin.js");
require("./callback/group/chineseDictionaryWord.js");

// 私聊回调列表
require("./callback/friend/login.js");
require("./callback/friend/days.js");
require("./callback/friend/qrcode.js");
require("./callback/friend/encodeQrcode.js");
require("./callback/friend/kana.js");
require("./callback/friend/miao.js");
require("./callback/friend/roll.js");
require("./callback/friend/pinyin.js");
require("./callback/friend/chineseDictionaryWord.js");
