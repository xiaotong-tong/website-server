const Import = require("../../verify.js");

async function sendPhoto({ qq, groupNo, message, nickName }) {
	if (message === "/图片") {
		const photo = await fetch("https://api.xtt.moe/photos/bot/randomOne").then((response) => response.json());

		Import.sendGroupMessage(groupNo, [
			{
				type: "Image",
				url: photo.url
			}
		]);
	}
}

Import.groupCallbackList.push(sendPhoto);
