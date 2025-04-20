const express = require("express");
const router = express.Router();

const Client = require("./client.js");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
	try {
		const file = req.file || req.body.file;

		if (!file) {
			return res.status(400).send("No file uploaded.");
		}

		let fileData;
		let base64FileType;

		if (file.buffer || (typeof file === "string" && file.startsWith("data:image/"))) {
			if (file.buffer) {
				fileData = file.buffer;
			} else {
				base64FileType = file.split(";")[0].split("/")[1];
				fileData = Buffer.from(file.split(",")[1], "base64");
			}
		} else {
			return res.status(400).send("Wrong file type.");
		}

		// 在文件名名前加上时间戳，防止重名
		const filePath =
			"images/upload/" + Date.now() + (base64FileType ? "." + base64FileType : "-" + file.originalname);

		// 将文件上传到阿里云OSS
		const result = await Client.put(filePath, fileData, {
			headers: {
				"x-oss-object-acl": "public-read"
			}
		});

		const resUrl = result.url.replace(/http.*?(com|cn|cool)/, "https://image.xtt.cool");

		res.send({
			message: "File uploaded to OSS successfully",
			url: resUrl
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
