const { random, startsWith } = require("xtt-utils");

const parseRoll = (dice) => {
	if (!dice) return "";

	if (!startsWith(dice, /^[.。]r/)) return "";

	if (dice === ".r" || dice === "。r") {
		dice = ".rd100";
	}

	const baseDiceGrep = /([1-9][0-9]*)?d?((?:[1-9][0-9]*)|%)?((max|min)([1-9][0-9]*))?/iu;
	const operatorGrep = /([+\-*/%]|\*\*)/iu;

	const finishedGrep = new RegExp(
		`^[.。]r(${baseDiceGrep.source})((?:${operatorGrep.source}${baseDiceGrep.source})*)$`,
		"iu"
	);

	const sucess = finishedGrep.test(dice);

	if (!sucess) return "";

	const resObj = {
		value: 0,
		rolls: []
	};

	const replacedDice = dice.replace(new RegExp(baseDiceGrep.source, baseDiceGrep.flags + "g"), (point) => {
		if (point.includes("d")) {
			let [_, quantity = 1, max = 100, boundary] = point.match(baseDiceGrep);

			if (max === "%") {
				max = 100;
			}
			let qty = 0;
			let rolls = [];

			for (let i = 0; i < quantity; i++) {
				let curRoll = random(1, max);
				let curFormatRoll = curRoll;
				if (boundary) {
					if (boundary.startsWith("max")) {
						const maxRoll = parseInt(boundary.slice(3));
						if (curRoll > maxRoll) {
							curFormatRoll = maxRoll;
							curRoll = maxRoll + "v";
						}
					} else if (boundary.startsWith("min")) {
						const minRoll = parseInt(boundary.slice(3));
						if (curRoll < minRoll) {
							curFormatRoll = minRoll;
							curRoll = minRoll + "^";
						}
					}
				}

				qty += curFormatRoll;
				rolls.push(curRoll);
			}
			resObj.rolls.push({
				value: qty,
				rolls,
				process: `${point}: [${rolls.join(", ")}] = ${qty}`,
				point
			});
			return qty;
		}

		return point;
	});

	resObj.value = Function("return " + replacedDice.slice(2))();
	return resObj;
};

module.exports = parseRoll;
