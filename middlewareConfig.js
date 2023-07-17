require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

module.exports = (app) => {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(cors());

	require("./routes/index.js")(app);
};
