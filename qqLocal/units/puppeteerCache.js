const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.resolve(__dirname, "../font_cache");

// 创建字体缓存目录
if (!fs.existsSync(CACHE_DIR)) {
	fs.mkdirSync(CACHE_DIR);
}

async function puppeteerCache(page) {
	// 启用请求拦截
	await page.setRequestInterception(true);

	page.on("request", async (request) => {
		const url = new URL(request.url());
		const resourceType = request.resourceType();

		if (resourceType === "font" || resourceType === "image") {
			const filePath = path.join(CACHE_DIR, path.basename(url.pathname));

			if (fs.existsSync(filePath)) {
				// 如果字体文件已缓存，则从缓存中读取
				const fontBuffer = fs.readFileSync(filePath);
				request.respond({
					status: 200,
					body: fontBuffer
				});
				return;
			}
		}

		request.continue();
	});

	page.on("response", async (response) => {
		const url = new URL(response.url());
		const resourceType = response.request().resourceType();

		if (resourceType === "font" || resourceType === "image") {
			const filePath = path.join(CACHE_DIR, path.basename(url.pathname));

			if (!fs.existsSync(filePath)) {
				// 如果字体文件未缓存，则缓存字体文件
				const fontBuffer = await response.buffer();
				fs.writeFileSync(filePath, fontBuffer);
			}
		}
	});
}

module.exports = puppeteerCache;
