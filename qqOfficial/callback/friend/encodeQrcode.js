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
					content: "未找到要解析的内容QAQ",
					msg_type: 0,
					msg_id: d.id // 必填，用来确认是被动回复的标志
				});
				return;
			}

			Jimp.read(url, (err, image) => {
				if (err) {
					console.error(err);
					return;
				}

				const pixelData = image.bitmap.data;

				const code = jsQR(pixelData, image.bitmap.width, image.bitmap.height);

				if (!code?.data) {
					Import.sendFriendMessage(d.author.user_openid, {
						content: "未找到二维码QAQ",
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
