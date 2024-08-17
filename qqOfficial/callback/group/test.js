const Import = require("../../verify.js");

async function doShareTest(d) {
	if (d.content.trim() === "/test") {
		Import.sendGroupMessage(d.group_openid, {
			content: "喵喵喵~",
			msg_type: 0
		});
	}
}

Import.groupCallbackList.push(doShareTest);
