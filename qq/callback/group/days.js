const Import = require("../../verify.js");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const puppeteer = require("puppeteer");

const quotesList = require("days-quotes");
const originDay = dayjs("2024-04-14");
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

// async function doShareDaysQuotes({ qq, groupNo, message, nickName }) {
// 	if (message === "/今日日语") {
// 		const key = dayjs().diff(originDay, "day");

// 		if (key > quotesList.quotesCount) {
// 			key = key % quotesList.quotesCount;
// 		}

// 		Import.sendGroupMessage(groupNo, [
// 			{
// 				type: "Plain",
// 				text: quotesList.list[key - 1].sentence
// 			}
// 		]);
// 	}
// }

async function doShareDaysQuotesImage({ qq, groupNo, message, nickName }) {
	if (message === "/今日日语") {
		const key = dayjs().diff(originDay, "day");

		if (key > quotesList.quotesCount) {
			key = key % quotesList.quotesCount;
		}

		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--ignore-certificate-errors"]
		});
		const page = await browser.newPage();
		await page.goto("https://xtt.moe/bot/ruby");

		await page.waitForSelector("#bot-ruby");

		// 更改页面中 id 为 bot-ruby 的 HTML 内容
		await page.evaluate((ruby) => {
			document.getElementById("bot-ruby").innerHTML = ruby;
		}, (innerHTML = quotesList.list[key - 1].parse));

		// 获取元素高度
		const height = await page.evaluate(() => {
			const element = document.getElementById("bot-ruby");
			return element.offsetHeight || 0;
		});

		// 截取元素的图片
		let image = await page.screenshot({
			clip: {
				x: 0,
				y: 0,
				width: 540,
				height: height
			}
		});

		Import.sendGroupMessage(groupNo, [
			{
				type: "Plain",
				text: quotesList.list[key - 1].sentence
			},
			{
				type: "Image",
				base64: image.toString("base64")
			}
		]);

		image = null;
		await browser.close();
	}
}

Import.groupCallbackList.push(doShareDaysQuotesImage);
