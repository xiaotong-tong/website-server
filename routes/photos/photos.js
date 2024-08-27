const sequelize = require("../../config/db.js");
const express = require("express");
const router = express.Router();

const photos = require("../../model/photos.js");

router.get("/list", async (req, res) => {
	try {
		const { botUse } = req.query;

		const photosList = await photos.findAll(
			{
				attributes: ["id", "url", "botUse"],
				order: [["id", "ASC"]],
				where: Object.assign(
					{},
					botUse === undefined
						? {}
						: {
								botUse: botUse === "true" ? true : false
						  }
				)
			},
			{
				raw: true
			}
		);
		res.send(photosList);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post("/add", async (req, res) => {
	try {
		const { url, bot } = req.body;

		let newPhoto;
		if (typeof url === "string") {
			newPhoto = await photos.create({ url, botUse: !!bot });
		} else if (Array.isArray(url)) {
			newPhoto = await photos.bulkCreate(url.map((item) => ({ url: item, botUse: !!bot })));
		} else {
			res.status(400).send("url is required");
			return false;
		}

		res.send(newPhoto);
		newPhoto = null;
	} catch (error) {
		res.status(500).send(error);
	}
});

router.get("/bot/randomOne", async (req, res) => {
	try {
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

		res.send(photo);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
