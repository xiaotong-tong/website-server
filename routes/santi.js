const express = require("express");
const router = express.Router();

const santi = require("../model/santi.js");

router.get("/list", async (req, res) => {
	try {
		const santiList = await santi.findAll(
			{
				attributes: ["id", "content", "topic"],
				order: [["id", "DESC"]],
				where: {
					isDelete: false
				}
			},
			{
				raw: true
			}
		);
		res.send(santiList);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post("/add", async (req, res) => {
	try {
		const passed = req.passed;

		if (!passed) {
			res.status(401).send({
				code: 401,
				msg: "Unauthorized"
			});
			return false;
		}

		const { content, topic } = req.body;

		if (!content) {
			res.status(400).send({
				code: 400,
				msg: "content is required"
			});
			return false;
		}
		if (!topic) {
			res.status(400).send({
				code: 400,
				msg: "topic is required"
			});
			return false;
		}

		const newSanti = await santi.create({
			content,
			topic
		});

		res.send({
			code: 200,
			data: newSanti
		});
		newPhoto = null;
	} catch (error) {
		res.status(500).send({
			code: 500,
			msg: error
		});
	}
});

router.delete("/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deleteSanti = await santi.update(
			{
				isDelete: true
			},
			{
				where: {
					id
				}
			}
		);
		res.send(deleteSanti);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
