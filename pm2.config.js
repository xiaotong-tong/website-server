module.exports = {
	apps: [
		{
			name: "server",
			script: "./index.js"
		},

		//		{
		//			name: "mirai qq worker",
		//			script: "./qq/verify.js"
		//		},
		{
			name: "qqOfficial worker",
			script: "./qqOfficial/verify.js"
		}
		//		{
		//			name: "qqOfficial sandbox worker",
		//			script: "./qqOfficial/verify.js",
		//			env: {
		//				sandbox: "true" // 环境变量
		//			}
		//		}
	]
};
