const Import = require("../../verify.js");
const puppeteer = require("puppeteer");
const puppeteerCache = require("../../units/puppeteerCache.js");

let running = false;

async function doShareWebHome({ qq, groupNo, message, nickName }) {
	if (message === "/主页") {
		if (running) {
			Import.sendGroupMessage(groupNo, [
				{
					type: "Plain",
					text: "正在当前任务中，请稍候再试。"
				}
			]);
			return;
		}

		running = true;
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

		await puppeteerCache(page);

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
		running = false;
		await browser.close();
	}
}

async function doShareHello({ qq, groupNo, message, nickName }) {
	if (message === "/hello") {
		Import.sendGroupMessage(groupNo, [
			{
				type: "Plain",
				text: "World!"
			}
		]);
	}
}

Import.groupCallbackList.push(doShareWebHome, doShareHello);
