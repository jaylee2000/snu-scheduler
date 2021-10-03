function generateYoilBlocks(subject) {
	if(!subject) return {monBlock: [], tueBlock: [], wedBlock: [], thurBlock: [], friBlock: []};
	else {
		const monBlock = [];
		for(let i = 0; i < subject.mon.length; i += 2) {
			monBlock.push([subject.mon[i], subject.mon[i+1]]);
		}
		console.log(monBlock);
		const tueBlock = [];
		for(let i = 0; i < subject.tue.length; i += 2) {
			tueBlock.push([subject.tue[i], subject.tue[i+1]]);
		}
		console.log(tueBlock);
		const wedBlock = [];
		for(let i = 0; i < subject.wed.length; i += 2) {
			wedBlock.push([subject.wed[i], subject.wed[i+1]]);
		}
		console.log(wedBlock);
		const thurBlock = [];
		for(let i = 0; i < subject.thur.length; i += 2) {
			thurBlock.push([subject.thur[i], subject.thur[i+1]]);
		}
		console.log(thurBlock);
		const friBlock = [];
		for(let i = 0; i < subject.fri.length; i += 2) {
			friBlock.push([subject.fri[i], subject.fri[i+1]]);
		}
		console.log(friBlock);
		return {monBlock, tueBlock, wedBlock, thurBlock, friBlock};
	}
}

module.exports = {generateYoilBlocks};