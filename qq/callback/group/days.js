const Import = require("../../verify.js");
const dayjs = require("dayjs");
var timezone = require("dayjs/plugin/timezone");

const quotesList = require("days-quotes");
const originDay = dayjs("2024-04-14");
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

async function doShareDaysQuotes({ qq, groupNo, message, nickName }) {
	if (message === "/今日日语") {
		const key = dayjs().diff(originDay, "day");

		if (key > quotesList.quotesCount) {
			key = key % quotesList.quotesCount;
		}

		Import.sendGroupMessage(groupNo, [
			{
				type: "Plain",
				text: quotesList.list[key - 1].sentence
			}
		]);
	}
}

Import.groupCallbackList.push(doShareDaysQuotes);
