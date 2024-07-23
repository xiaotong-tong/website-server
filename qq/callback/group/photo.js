const sequelize = require("../../../config/db.js");
const Import = require("../../verify.js");
const photos = require("../../../model/photos.js");

async function doLogin({ qq, groupNo, message, nickName }) {
	if (message === "/图片") {
		const photo = await photos.findOne(
			{
				where: {
					botUse: true
				},
				order: sequelize.literal("rand()")
			},
			{
				raw: true
			}
		);

		Import.sendGroupMessage(groupNo, [
			{
				type: "Image",
				url: photo.url
			}
		]);
	}
}

Import.groupCallbackList.push(doLogin);
