require("dotenv").config();
const app = require("express")();

require("./middlewareConfig.js")(app);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
