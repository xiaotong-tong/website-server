const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { fork } = require("child_process");

const multer = require("multer");

const catchPath = "uploads/catch/font";

// 创建 uploads/catch/font 文件夹
if (!fs.existsSync(catchPath)) {
	fs.mkdirSync(catchPath, { recursive: true });
}

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, catchPath);
		},
		filename: (req, file, cb) => {
			cb(null, file.originalname);
		}
	})
});

const fileStates = new Map();

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

	// 返回正在工作的状态码，并设置 文件状态 为 pending
	const filename = file.originalname.replace(".ttf", "");
	fileStates.set(filename, "pending");
	res.status(202).send({
		url: `${req.protocol}://${
			req.hostname + (req.hostname === "localhost" ? ":" + process.env.PORT : "")
		}/widget/download/woff2/${filename + ".woff2"}`,
		note: "The file will be deleted at 3:00 AM every day.",
		massage: "请轮询 url 参数中的连接，直到返回 200 状态码，即可下载转换后的 woff2 文件。"
	});

	const filePath = path.join(file.path);

	// 因为 ttf2woff2(ttf) 的运行时间较长，所以使用子进程来运行，避免阻塞主进程
	const childProcess = fork(path.join(__dirname, "./child_ttf2woff2.js"));
	childProcess.send(filePath);
	childProcess.on("message", () => {
		// 子进程完成任务后，设置 文件状态 为 done
		fileStates.set(file.originalname.replace(".ttf", ""), "done");
	});
});

// 获取转换后的 woff2 文件
router.get("/download/woff2/:filename", async (req, res) => {
	// 下载 woff2 文件
	const filename = req.params.filename;

	// 如果 fileStates 中存在，并且状态为 pending，代表文件还在写入中，返回 202 状态码
	if (fileStates.get(filename.replace(".woff2", "")) === "pending") {
		return res.status(202).send("文件还没写入完成");
	}

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

const cron = require("node-cron");
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
