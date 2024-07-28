const Import = require("../../verify.js");
const puppeteer = require("puppeteer");

async function doShareWebHome({ qq, groupNo, message, nickName }) {
	if (message === "/主页") {
		const browser = await puppeteer.launch({
			headless: true,
			args: [
				"--no-sandbox",
				"--ignore-certificate-errors"
				// "--font-render-hinting=none",
				// "--disable-font-subpixel-positioning"
			]
		});
		const page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 1080 });
		await page.goto("https://xtt.moe", {
			waitUntil: "networkidle0",
			timeout: 0
		});

		// 截取元素的图片
		let image = await page.screenshot({
			fullPage: true
		});

		Import.sendGroupMessage(groupNo, [
			{
				type: "Image",
				base64: image.toString("base64")
			}
		]);

		image = null;
		await browser.close();
	}
}

Import.groupCallbackList.push(doShareWebHome);
