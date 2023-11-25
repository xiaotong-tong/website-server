const OSS = require("ali-oss");

const Client = new OSS({
	region: process.env.OSS_REGION,
	accessKeyId: process.env.OSS_ACCESS_KEY_ID,
	accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
	bucket: process.env.OSS_BUCKET,
	endpoint: process.env.OSS_ENDPOINT,
	cname: true
});

module.exports = Client;
