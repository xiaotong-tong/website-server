const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const cron = require("node-cron");

const multer = require("multer");

const catchPath = "uploads/catch/font";
const upload = multer({ dest: catchPath });

const ttf2woff2 = require("ttf2woff2");

// 上传 ttf 文件，转换为 woff2
router.post("/file/ttftowoff2", upload.single("file"), async (req, res) => {
	const file = req.file;

	if (!file) {
		return res.status(400).send("No file uploaded.");
	}

	if (file.mimetype !== "font/ttf") {
		// 如果文件不是 ttf，就删除文件，并返回 400 状态码
		fs.unlink(file.path, (err) => {
			if (err) {
				console.error(err);
			}
		});

		return res.status(400).send("Wrong file type. Only ttf is allowed.");
	}

	const filePath = path.join(file.destination, file.originalname);
	fs.renameSync(file.path, filePath);

	const ttf = fs.readFileSync(filePath);
	fs.writeFileSync(filePath.replace(/.ttf$/, ".woff2"), ttf2woff2(ttf));

	res.send({
		url: `${req.protocol}://${
			req.hostname + (req.hostname === "localhost" ? ":" + process.env.PORT : "")
		}/widget/download/woff2/${file.originalname.replace(/.ttf$/, ".woff2")}`,
		note: "The file will be deleted at 3:00 AM every day."
	});
});

// 获取转换后的 woff2 文件
router.get("/download/woff2/:filename", async (req, res) => {
	// 下载 woff2 文件
	const filename = req.params.filename;

	const filePath = path.join(catchPath, filename);

	// 检测 file 是否存在
	if (!fs.existsSync(filePath)) {
		return res.status(404).send("File not found.");
	}

	res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
	res.download(filePath);
});

const routes = (app) => {
	app.use("/widget", router);
};

module.exports = routes;

// 在每天三点时，删除 uploads/catch/font 文件夹下的所有文件
cron.schedule("0 3 * * *", () => {
	const folderPath = path.join(catchPath);

	fs.readdir(folderPath, (err, files) => {
		if (err) {
			console.error(err);
		}

		for (const file of files) {
			fs.unlink(path.join(folderPath, file), (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
	});
});
