const { random, startsWith } = require("xtt-utils");

function parseRoll(text) {
	if (!text) return "";

	if (!startsWith(text, /^[.。]r/)) return "";

	const matches = text.match(
		/^[.。]r(?<quantity>[1-9][0-9]*)?d?(?<max>([1-9][0-9]*)|%)?(?<sub>[+-])?(?<subNumber>\d+)?\p{Zs}?(?<judgment>[1-9][0-9]*)?$/iu
	);

	if (!matches) return "";

	let { quantity = 1, max = 100, sub, subNumber = 0, judgment } = matches.groups;

	if (max === "%") {
		max = 100;
	}

	let rollsQty = 0;
	for (let i = 0; i < quantity; i++) {
		rollsQty += random(1, max);
	}
	if (sub) {
		rollsQty += sub === "+" ? Number(subNumber) : -Number(subNumber);
	}
	if (judgment) {
		rollsQty = rollsQty >= Number(judgment);
	}
	return rollsQty;
}

module.exports = parseRoll;
