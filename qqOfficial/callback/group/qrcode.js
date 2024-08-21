require("dotenv").config();
const Import = require("../../verify.js");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function uploadLocalImage() {
	const fd = new FormData();
	fd.append("source", fs.createReadStream(path.join(__dirname, "qrcode.png")));

	const res = await axios.post(
		`https://api.xtt.moe/api/image/upload/?key=${process.env.CHEVERETO_KEY}&format=json`,
		fd,
		{
			headers: {
				"Content-Type": "multipart/form-data"
			}
		}
	);

	return res.data;
}

async function sendQRCode(d) {
	if (d.content.trim().startsWith("/二维码")) {
		try {
			const content = d.content.trim().slice(4).trim();

			if (!content) {
				Import.sendGroupMessage(d.group_openid, {
					content: "请输入正确的内容，例如格式为：/二维码 hello world",
					msg_type: 0,
					msg_id: d.id // 必填，用来确认是被动回复的标志
				});
				return;
			}

			QRCode.toFile(
				path.join(__dirname, "qrcode.png"),
				d.content.slice(4).trim(),
				{
					type: "terminal",
					width: 200,
					errorCorrectionLevel: "H",
					margin: 1
				},
				async (err, buffer) => {
					if (err) {
						console.error(err);

						Import.sendGroupMessage(d.group_openid, {
							content: "生成二维码失败",
							msg_type: 0,
							msg_id: d.id // 必填，用来确认是被动回复的标志
						});
						return;
					}

					let resUrl = await uploadLocalImage();

					resUrl = resUrl.image.url;
					resUrl = resUrl.replace("https://image.xtt.moe/", "https://image.xtt.moe/local/");

					Import.sendGroupMessage(d.group_openid, {
						type: 1,
						file_type: 1,
						url: resUrl,
						srv_send_msg: false,
						msg_id: d.id // 必填，用来确认是被动回复的标志
					});
				}
			);
		} catch (e) {
			console.error(e);
		}
	}
}

Import.groupCallbackList.push(sendQRCode);
