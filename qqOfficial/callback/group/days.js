const Import = require("../../verify.js");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");

const quotesList = require("days-quotes");
const originDay = dayjs("2024-04-14");
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

async function doShareDaysQuotesImage(d) {
	if (d.content.trim() === "/今日日语") {
		let key = dayjs().diff(originDay, "day");

		if (key > quotesList.quotesCount) {
			key = key % quotesList.quotesCount;
		}

		console.log(quotesList.list[key - 1].sentence);

		Import.sendGroupMessage(d.group_openid, {
			content: quotesList.list[key - 1].sentence,
			msg_type: 0
		});
	}
}

Import.groupCallbackList.push(doShareDaysQuotesImage);
