const Import = require("../../verify.js");
const { exec } = require("child_process");
const parse = require("shell-quote/parse");
const quote = require("shell-quote/quote");

async function sendCurl({ qq, groupNo, message, nickName }) {
	if (message.startsWith("curl")) {
		try {
			exec(quote(parse(message)), (error, stdout, stderr) => {
				if (error) {
					console.error(`执行 curl 命令失败: ${error}`);

					Import.sendGroupMessage(groupNo, [
						{
							type: "Plain",
							text: "执行 curl 命令失败"
						}
					]);
					return;
				}

				Import.sendGroupMessage(groupNo, [
					{
						type: "Plain",
						text: "执行结果: \n" + stdout
					}
				]);
			});
		} catch (e) {
			console.error(e);

			Import.sendGroupMessage(groupNo, [
				{
					type: "Plain",
					text: "执行失败"
				}
			]);
		}
	}
}

Import.groupCallbackList.push(sendCurl);
