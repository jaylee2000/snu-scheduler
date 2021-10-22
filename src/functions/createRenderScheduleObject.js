const { mondayToFriday } = require("../definitions/arrays");

function createRenderScheduleObject(possibleSchedules) {
	const numDisplay = possibleSchedules >= 6 ? 6 : possibleSchedules.length;
	const Schedules = {};
	for(let i = 0; i < numDisplay; i++) {
		let optionName = i; // option_0 --> 0
		
		let thisSchedule = possibleSchedules[i];
		let Schedule = {};
		
		Schedule["Weight"] = thisSchedule.weightSum;
		Schedule["Credit"] = thisSchedule.creditSum;
		for(let day of mondayToFriday) {
			Schedule[day] = [];
		}
		
		for(let j = 0; j < thisSchedule.selectedClasses.length; j++) {
			let Subject = thisSchedule.selectedClasses[j];
			for(let day of mondayToFriday) {
				for(let k = 0; k < Subject[day].length; k ++) {
					let timeBlock = {};
					timeBlock["data-start"] = formatTime(Subject[day][k][0]);
					timeBlock["data-end"] = formatTime(Subject[day][k][1]);
					timeBlock["data-content"] = Subject._id.toString();
					timeBlock["subject-name"] = Subject.subjectName;
					Schedule[day].push(timeBlock);
				}
			}
		}
		Schedules[optionName] = Schedule;
	}
	return Schedules;
}

function formatTime(t1) {
	let t1_input = parseFloat(t1);
	let hour = Math.floor(t1_input);
	let min = Math.floor((t1_input - hour) * 60);
	
	if(hour < 10) {
		let hour_str = '0' + hour.toString();
		if(min < 10) {
			let min_str = '0' + min.toString();
			return hour_str + ':' + min_str;
		} else {
			let min_str = min.toString();
			return hour_str + ':' + min_str;
		}
	} else {
		let hour_str = hour.toString();
		if(min < 10) {
			let min_str = '0' + min.toString();
			return hour_str + ':' + min_str;
		} else {
			let min_str = min.toString();
			return hour_str + ':' + min_str;
		}
	}
}

module.exports = {createRenderScheduleObject, formatTime};