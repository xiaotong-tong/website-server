const ttf2woff2 = require("ttf2woff2");
const fs = require("fs");

process.on("message", (filePath) => {
	// 在子进程中，读取 ttf 文件，转换为 woff2
	const ttf = fs.readFileSync(filePath);
	fs.writeFileSync(filePath.replace(/.ttf$/, ".woff2"), ttf2woff2(ttf));

	// 通知父进程，已经完成任务
	process.send("done");

	// 退出子进程
	process.exit();
});
