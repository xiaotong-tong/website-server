const express = require("express");
const router = express.Router();

const Words = require("../model/word.js");

router.post("/add", async (req, res) => {
	if (req.passed) {
		try {
			await Words.create({
				word: req.body.word,
				kana: req.body.kana,
				accent: req.body.accent,
				english: req.body.english,
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
			attributes: ["id", "word", "kana", "accent", "english", "mean", "read"],
			order: [["id", "DESC"]]
		});

		res.send(words);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.put("/edit/:id", async (req, res) => {
	if (req.passed) {
		try {
			const updateOption = {};

			if (req.body.word) {
				updateOption.word = req.body.word;
			}
			if (req.body.kana) {
				updateOption.kana = req.body.kana;
			}
			if (req.body.accent) {
				updateOption.accent = req.body.accent;
			}
			if (req.body.english) {
				updateOption.english = req.body.english;
			}
			if (req.body.mean) {
				updateOption.mean = req.body.mean;
			}
			if (req.body.read) {
				updateOption.read = req.body.read;
			}

			await Words.update(updateOption, {
				where: {
					id: req.params.id
				}
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

module.exports = router;
