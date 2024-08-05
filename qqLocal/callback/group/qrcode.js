const Import = require("../../verify.js");
const QRCode = require("qrcode");

async function sendQRCode({ qq, groupNo, message, nickName }) {
	if (message.startsWith("/qrcode-")) {
		try {
			QRCode.toDataURL(
				message.slice(8),
				{
					type: "terminal",
					width: 200,
					errorCorrectionLevel: "H",
					margin: 1
				},
				(err, url) => {
					if (err) {
						console.error(err);

						Import.sendGroupMessage(groupNo, [
							{
								type: "Plain",
								text: "生成二维码失败"
							}
						]);
						return;
					}

					Import.sendGroupMessage(groupNo, [
						{
							type: "Image",
							base64: url.split(",")[1]
						}
					]);
				}
			);
		} catch (e) {
			console.error(e);
		}
	}
}

Import.groupCallbackList.push(sendQRCode);
