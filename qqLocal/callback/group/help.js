const Import = require("../../verify.js");

async function doShareHelp({ qq, groupNo, message, nickName }) {
	if (message === "/help") {
		Import.sendGroupMessage(groupNo, [
			{
				type: "Plain",
				text: "哥哥，这边请 https://xtt.moe/bot"
			}
		]);
	}
}

async function doShareHello({ qq, groupNo, message, nickName }) {
	if (message === "/ping") {
		Import.sendGroupMessage(groupNo, [
			{
				type: "Plain",
				text: "喵喵喵~"
			}
		]);
	}
}

Import.groupCallbackList.push(doShareHelp, doShareHello);
