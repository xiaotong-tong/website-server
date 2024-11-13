const Import = require("../../verify.js");
const dayjs = require("../../../utils/dateUtil.js");

const quotesList = require("days-quotes");
const originDay = dayjs("2024-08-29");

async function doShareDaysQuotesImage(d) {
	if (d.content.trim() === "/今日日语") {
		let key = dayjs().diff(originDay, "day");

		if (key > quotesList.quotesCount) {
			key = key % quotesList.quotesCount;
		}

		Import.sendFriendMessage(d.author.user_openid, {
			content: quotesList.list[key - 1].sentence,
			msg_type: 0,
			msg_id: d.id // 必填，用来确认是被动回复的标志
		});
	}
}

Import.friendCallbackList.push(doShareDaysQuotesImage);
