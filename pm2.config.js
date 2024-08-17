module.exports = {
	apps: [
		{
			name: "qqLocal worker",
			script: "./qqLocal/verify.js"
		},
		{
			name: "qqOfficial worker",
			script: "./qqOfficial/verify.js"
		}
	]
};
