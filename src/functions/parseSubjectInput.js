function parseSubjectInput(mon, tue, wed, thur, fri) {
	return {
		mon: mon.match(/\d+/g) || [],
		tue: tue.match(/\d+/g) || [],
		wed: wed.match(/\d+/g) || [],
		thur: thur.match(/\d+/g) || [],
		fri: fri.match(/\d+/g) || []
	}	
}

module.exports = {parseSubjectInput};