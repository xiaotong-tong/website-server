const ChineseDictionaryWord = require("../model/chineseDictionaryWord.js");

const jsonDatas = require("chinese-dictionary/word/word.json");

async function start() {
	for await (const element of jsonDatas) {
		await ChineseDictionaryWord.create({
			word: element.word,
			pinyin: element.pinyin,
			abbr: element.abbr,
			explanation: element.explanation
		});
	}
}

start();
