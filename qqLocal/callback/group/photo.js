const Import = require("../../verify.js");

async function sendPhoto({ qq, groupNo, message, nickName }) {
	if (message === "/图片") {
		try {
			const photo = await fetch("https://api.xtt.moe/photos/bot/randomOne").then((response) => response.json());

			Import.sendGroupMessage(groupNo, [
				{
					type: "Image",
					url: photo.url
				}
			]);
		} catch (e) {
			console.error(e);

			Import.sendGroupMessage(groupNo, [
				{
					type: "Plain",
					text: "获取图片失败"
				}
			]);
		}
	}
}

Import.groupCallbackList.push(sendPhoto);
