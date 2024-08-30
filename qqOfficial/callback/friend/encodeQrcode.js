require("dotenv").config();
const Import = require("../../verify.js");
const Jimp = require("jimp");
const jsQR = require("jsqr");

async function sendEncodeQRCode(d) {
	if (d.content.trim().startsWith("/解析二维码")) {
		try {
			const url = d.attachments?.[0]?.url;

			if (!url) {
				Import.sendFriendMessage(d.author.user_openid, {
					content: "涟没有找到要解析的图片QAQ",
					msg_type: 0,
					msg_id: d.id // 必填，用来确认是被动回复的标志
				});
				return;
			}

			Jimp.read(url, (err, image) => {
				if (err) {
					console.error(err);
					Import.sendGroupMessage(d.user_openid, {
						content: "解析图片失败了，涟也不知道为什么QAQ",
						msg_type: 0,
						msg_id: d.id // 必填，用来确认是被动回复的标志
					});
					return;
				}

				const pixelData = image.bitmap.data;

				const code = jsQR(pixelData, image.bitmap.width, image.bitmap.height);

				if (!code?.data) {
					Import.sendFriendMessage(d.author.user_openid, {
						content: "啊咧，涟没有在图片中找到二维码",
						msg_type: 0,
						msg_id: d.id // 必填，用来确认是被动回复的标志
					});
					return;
				}

				Import.sendFriendMessage(d.author.user_openid, {
					content: code.data,
					msg_type: 0,
					msg_id: d.id // 必填，用来确认是被动回复的标志
				});
			});
		} catch (e) {
			console.error(e);
		}
	}
}

Import.friendCallbackList.push(sendEncodeQRCode);
