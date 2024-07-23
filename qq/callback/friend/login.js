const Import = require("../../verify.js");
const Verify = require("../../../model/verify.js");

async function doLogin({ qq, message, nickName }) {
	if (message === "登录") {
		// 如果有当前qq的，就删除，然后重新创建新的。
		await Verify.destroy({
			where: {
				qq: qq
			}
		});

		const item = await Verify.create({
			qq: qq,
			nickName: nickName
		});

		Import.sendFriendMessage(qq, [
			{
				type: "Plain",
				text: `您的登录口令为\n${item.password}\n请勿泄露哦(◍＞◡＜◍)`
			}
		]);
	}
}

Import.friendCallbackList.push(doLogin);
