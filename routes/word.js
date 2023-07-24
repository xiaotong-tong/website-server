const express = require("express");
const router = express.Router();

const Words = require("../model/word.js");

router.post("/add", (req, res) => {
	if (req.passed) {
		try {
			Words.create({
				word: req.body.word,
				kana: req.body.kana,
				accent: req.body.accent,
				mean: req.body.mean,
				read: req.body.read
			});

			res.send("success");
		} catch (error) {
			res.status(500).send({
				value: "error",
				message: error
			});
		}
	} else {
		res.status(401).send({
			value: "error",
			message: "Unauthorized"
		});
	}
});

router.get("/list", async (req, res) => {
	try {
		const words = await Words.findAll({
			attributes: ["id", "word", "kana", "accent", "mean", "read"],
			order: [["id", "DESC"]]
		});

		res.send({
			value: "success",
			data: words
		});
	} catch (error) {
		res.status(500).send({
			value: "error",
			message: error
		});
	}
});

module.exports = router;
