require("dotenv").config();
const WebSocket = require("ws");

const domain = "https://sandbox.api.sgroup.qq.com";
let accessToken;
let ws;
let session;
let seq;
let sessionID;
let heartbeatInterval;

const groupCallbackList = [];
const friendCallbackList = [];
const tempCallbackList = [];

let friendListPromiseResolve;
const friendListPromise = new Promise((resolve) => {
	friendListPromiseResolve = resolve;
});

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
			console.log("str", str);
			const parsedJson = JSON.parse(str);

			// 成功创建连接，心跳包
			if (parsedJson.op === 10) {
				// 获取心跳周期
				heartbeatInterval = parsedJson.d.heartbeat_interval;

				// 鉴权
				const response = {
					op: 2,
					d: {
						token: `Bot ${process.env.QQ_BOT_ID}.${process.env.QQ_BOT_TOKEN}`,
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
				console.log("Bot is ready");
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
				console.log("Heartbeat ACK");
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
						callback(parsedJson.d);
					} catch (err) {
						// 捕获错误，防止一个 callback 出错导致其他 callback 无法执行
						console.error("Error in group callback:", err);
					}
				});
			}

			if (parsedJson.syncId === "") {
				session = parsedJson.data.session;
			} else if (parsedJson.syncId === "-1") {
				try {
					const data = parsedJson.data;

					if (data.code === 500) {
						return;
					}

					// 忽略自己发送的消息
					if (!data.sender && data.code === 0) {
						return;
					}

					// 获取好友列表的返回
					if (data.code === 0 && data.data?.[0].id === 66600000) {
						friendListPromiseResolve(data.data);
						return;
					}

					const senderQQ = data.sender.id;
					const messageChain = data.messageChain;
					const message = messageChain.find((message) => message.type === "Plain");

					if (message) {
						const text = message.text;
						if (data.type === "FriendMessage") {
							const nickName = data.sender.nickname;
							friendCallbackList?.forEach((callback) => {
								try {
									callback({
										qq: senderQQ,
										message: text,
										nickName: nickName
									});
								} catch (err) {
									// 捕获错误，防止一个 callback 出错导致其他 callback 无法执行
									console.error("Error in friend callback:", err);
								}
							});
						} else if (data.type === "GroupMessage") {
							const senderGroupNo = data.sender.group.id;
							const nickName = data.sender.memberName;
							groupCallbackList?.forEach((callback) => {
								try {
									callback({
										qq: senderQQ,
										groupNo: senderGroupNo,
										message: text,
										nickName: nickName
									});
								} catch (err) {
									// 捕获错误，防止一个 callback 出错导致其他 callback 无法执行
									console.error("Error in group callback:", err);
								}
							});
						} else if (data.type === "TempMessage") {
							const senderGroupNo = data.sender.group.id;
							const nickName = data.sender.nickname;
							tempCallbackList?.forEach((callback) => {
								try {
									callback({
										qq: senderQQ,
										groupNo: senderGroupNo,
										message: text,
										nickName: nickName
									});
								} catch (err) {
									// 捕获错误，防止一个 callback 出错导致其他 callback 无法执行
									console.error("Error in temp callback:", err);
								}
							});
						}
					}
				} catch (err) {
					console.error("Error parsing message:", err);
					console.log("str", str);
				}
			}
		}
	});

	ws.on("error", function error(err) {
		console.error("WebSocket error:", err);
	});
}

async function getAppAccessToken() {
	const qqUrl = "https://bots.qq.com/app/getAppAccessToken";
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
}

async function getUrl() {
	await getAppAccessToken();

	const qqUrl = domain + "/gateway";
	const response = await fetch(qqUrl, {
		method: "GET",
		headers: {
			// Authorization: `Bot ${process.env.QQ_BOT_ID}.${process.env.QQ_BOT_TOKEN}`
			Authorization: `QQBot ${accessToken}`
		}
	});
	const data = await response.json();
	connectWS(data.url);
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
			media: data
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

	console.log(data);
	return data;
}

module.exports = {
	ws,
	sendGroupMessage,
	groupCallbackList,
	friendCallbackList,
	tempCallbackList
};

// 导入 callback 模块
require("./callback/group/test.js");
require("./callback/group/qrcode.js");
require("./callback/group/days.js");
