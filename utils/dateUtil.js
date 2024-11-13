const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

module.exports = dayjs;
