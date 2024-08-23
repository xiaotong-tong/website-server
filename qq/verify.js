require("dotenv").config();
const WebSocket = require("ws");

const url = `wss://qq.xtt.moe//wsUrl/message?verifyKey=${process.env.QQ_VERIFY_KEY}&qq=${process.env.QQ_NUMBER}`;
let ws;
let session;

const groupCallbackList = [];
const friendCallbackList = [];
const tempCallbackList = [];

let friendListPromiseResolve;
const friendListPromise = new Promise((resolve) => {
	friendListPromiseResolve = resolve;
});

async function connectWS() {
	console.log("Connecting to WebSocket", url);
	ws = new WebSocket(url);

	ws.on("open", function open() {
		console.log("connected");
	});

	ws.on("close", function close() {
		console.log("disconnected");
		connectWS();
	});

	ws.on("message", async function incoming(data) {
		if (Buffer.isBuffer(data)) {
			const str = data.toString("utf-8");
			// console.log("str", str);
			const parsedJson = JSON.parse(str);
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

connectWS();

// async function bindSession(session) {
// 	return fetch("https://qq.xtt.moe/bind", {
// 		method: "POST",
// 		body: JSON.stringify({
// 			sessionKey: session,
// 			qq: process.env.QQ_NUMBER
// 		})
// 	}).then((response) => response.json());
// }

function sendFriendMessage(target, messageChain) {
	if (!target) {
		console.error("No target specified");
		return;
	}

	if (!ws) {
		console.error("WebSocket not connected");
		return;
	}

	const response = {
		syncId: -1,
		command: "sendFriendMessage",
		content: {
			sessionKey: session,
			target,
			messageChain
		}
	};

	ws.send(JSON.stringify(response));
}

function sendGroupMessage(target, messageChain) {
	if (!target) {
		console.error("No target specified");
		return;
	}

	if (!ws) {
		console.error("WebSocket not connected");
		return;
	}

	const response = {
		syncId: -1,
		command: "sendGroupMessage",
		content: {
			sessionKey: session,
			target,
			messageChain
		}
	};

	ws.send(JSON.stringify(response));
}

function sendTempMessage(qq, group, messageChain) {
	if (!qq || !group) {
		console.error("No qq or no group specified");
		return;
	}

	console.log("sendTempMessage", qq, group, messageChain);

	if (!ws) {
		console.error("WebSocket not connected");
		return;
	}

	const response = {
		syncId: -1,
		command: "sendTempMessage",
		content: {
			sessionKey: session,
			qq,
			group,
			messageChain
		}
	};

	ws.send(JSON.stringify(response));
}

async function getFriendList() {
	if (!ws) {
		console.error("WebSocket not connected");
		return;
	}

	const response = {
		syncId: -1,
		command: "friendList",
		content: {
			sessionKey: session
		}
	};

	ws.send(JSON.stringify(response));

	return friendListPromise;
}

module.exports = {
	ws,
	sendFriendMessage,
	sendGroupMessage,
	sendTempMessage,
	groupCallbackList,
	friendCallbackList,
	tempCallbackList,
	getFriendList
};

// 导入 callback 模块
require("./callback/group/login.js");
require("./callback/friend/login.js");
require("./callback/temp/login.js");

require("./callback/group/curl.js");
