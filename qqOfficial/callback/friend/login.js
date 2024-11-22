const Import = require("../../verify.js");
const Verify = require("../../../model/verify.js");

async function doLogin(d) {
	if (d.content.trim() === "/登录") {
		const qq = d.author.user_openid;
		// 如果有当前qq的，就修改密码为新的 UUID
		let item = await Verify.findOne({
			where: {
				qqOpenId: qq
			}
		});

		if (item) {
			await item.update({
				password: Verify.sequelize.fn("UUID")
			});
			item = await Verify.findOne({
				where: {
					qqOpenId: qq
				}
			});
		} else {
			item = await Verify.create({
				qqOpenId: qq
			});
		}

		Import.sendFriendMessage(qq, {
			content: `您的登录口令为\n${item.password}\n请勿泄露哦(◍＞◡＜◍)`,
			msg_type: 0,
			msg_id: d.id // 必填，用来确认是被动回复的标志
		});
	}
}

Import.friendCallbackList.push(doLogin);
