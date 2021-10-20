function generateRegexForSearch(name) {
	const Kor_Eng_Num_Whitespace_Dash = '([\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]|[\w]|[\-]|[\s]|[ ])*';
	let regex = Kor_Eng_Num_Whitespace_Dash;
	for(let letter of name) {
		regex += `[${letter}]`;
		regex += Kor_Eng_Num_Whitespace_Dash;
	}
	return regex;
}

module.exports = { generateRegexForSearch };