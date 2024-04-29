const express = require("express");
const router = express.Router();

const photos = require("../../model/photos.js");

router.get("/list", async (req, res) => {
	try {
		const photosList = await photos.findAll(
			{
				attributes: ["id", "url"],
				order: [["id", "ASC"]]
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
		const { url } = req.body;

		let newPhoto;
		if (typeof url === "string") {
			newPhoto = await photos.create({ url });
		} else if (Array.isArray(url)) {
			newPhoto = await photos.bulkCreate(url.map((item) => ({ url: item })));
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

module.exports = router;
