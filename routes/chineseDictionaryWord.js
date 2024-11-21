const { Sequelize } = require("sequelize");
const express = require("express");
const router = express.Router();

const ChineseDictionaryWord = require("../model/chineseDictionaryWord.js");

router.get("/listOf100", async (req, res) => {
	try {
		const words = await ChineseDictionaryWord.findAll({
			attributes: ["id", "word", "explanation"],
			order: Sequelize.literal("RAND()"),
			limit: 100,
			where: {
				isTopic: false
			}
		});

		res.send(words);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.put("/edit/:id", async (req, res) => {
	if (req.passed) {
		try {
			const updateOption = {
				isTopic: req.body.isTopic || false
			};

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
