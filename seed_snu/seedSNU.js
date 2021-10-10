const xlsx = require("xlsx");
const path = require("path");
const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workbook = xlsx.readFile(path.join(__dirname, "./SNU2021-2.xlsx"));
const worksheet = workbook.Sheets["Sheet1"]
let data = xlsx.utils.sheet_to_json(worksheet);

const { validateSubject } = require("../src/utils/validateJoiSchemas.js");
const { ExpressError } = require("../src/utils/ExpressError.js");

function parseGrade(str) {
	if(!str) return str;
	if(str == "0") return "";
	else return str.slice(0, 1);
}

const dayOfWeekTable = {
	"월": "mon",
	"화": "tue",
	"수": "wed",
	"목": "thur",
	"금": "fri"
}

function precise(x) {
	return parseFloat(Number.parseFloat(x).toFixed(2));
}

function parseTimeBlock(str) {
	// str: 10:00~12:45
	let idx = 0;
	let h1 = str.slice(idx, str.indexOf(':'));
	idx = str.indexOf(':') + 1;
	let m1 = str.slice(idx, str.indexOf('~', idx));
	idx = str.indexOf('~') + 1;
	let h2 = str.slice(idx, str.indexOf(':', idx));
	idx = str.indexOf(':', idx) + 1;
	let m2 = str.slice(idx);
	return [precise(parseFloat(h1, 10) + parseFloat(m1, 10)/60), precise(parseFloat(h2, 10) + parseFloat(m2, 10)/60)];
}

function parseClassTime(str) {
	let obj = {
		mon: [],
		tue: [],
		wed: [],
		thur: [],
		fri: []
	};
	let idx = 0;
	while(idx < str.length) {
		let dayOfWeekEnglish = dayOfWeekTable[str[idx]];
		if(!dayOfWeekEnglish) {
			return obj;
		}
		let timeBlockStart = str.indexOf('(', idx);
		let timeBlockEnd = str.indexOf(')', idx);
		const parsedTimeBlock = parseTimeBlock(str.slice(timeBlockStart+1, timeBlockEnd));
		if(obj[dayOfWeekEnglish].length && obj[dayOfWeekEnglish][obj[dayOfWeekEnglish].length - 1][0] == parsedTimeBlock[0]
		   && obj[dayOfWeekEnglish][obj[dayOfWeekEnglish].length - 1][1] == parsedTimeBlock[1]) {
			;
		} else {
			obj[dayOfWeekEnglish].push(parsedTimeBlock);
		}
		idx = timeBlockEnd + 2;
	}
	return obj;
}

function parseCapacity(str) {
	const cutIdx = str.indexOf('(');
	if(cutIdx === -1) return str;
	return str.slice(0, cutIdx);
}

function sortFtn(a, b) {
	return a[0] - b[0];
}

const newData = data.map(function(subject){
	subject.classification = subject.교과구분;
	subject.college = subject.개설대학;
	subject.department = subject.개설학과;
	subject.degree = subject.이수과정;
	subject.grade = parseGrade(subject.학년);
	subject.subjectNum = subject.교과목번호;
	subject.classNum = subject.강좌번호;
	subject.subjectName = subject.교과목명;
	subject.credit = parseInt(subject.학점, 10);
	subject.lectureHours = parseInt(subject.강의);
	subject.labHours = parseInt(subject.실습, 10);
	subject.classTime = parseClassTime(subject.수업교시);
	subject.mon = subject.classTime["mon"].sort(sortFtn);
	subject.tue = subject.classTime["tue"].sort(sortFtn);
	subject.wed = subject.classTime["wed"].sort(sortFtn);
	subject.thur = subject.classTime["thur"].sort(sortFtn);
	subject.fri = subject.classTime["fri"].sort(sortFtn);
	subject.formOfClass = subject.수업형태;
	subject.roomNum = subject.강의실;
	subject.prof = subject.주담당교수;
	subject.capacity = parseCapacity(subject.정원);
	subject.remark = subject.비고;
	subject.language = subject.강의언어;
	subject.weight = 1;
	subject.mustTake = false;
	
	delete subject.교과구분;
	delete subject.개설대학;
	delete subject.개설학과;
	delete subject.이수과정;
	delete subject.학년;
	delete subject.교과목번호;
	delete subject.강좌번호;
	delete subject.교과목명;
	delete subject.학점;
	delete subject.강의;
	delete subject.실습;
	delete subject.수업교시;
	delete subject.수업형태;
	delete subject.강의실;
	delete subject.주담당교수;
	delete subject.정원;
	delete subject.비고;
	delete subject.강의언어;
	
	delete subject.부제명;
	delete subject.수강신청인원;
	delete subject.개설상태;
	
	delete subject.classTime;
	
	return subject;
});

const subjectSchemaFull = Joi.object({
	subject: Joi.object({
		classification: Joi.string().allow(''),
		college : Joi.string().allow(''),
		department : Joi.string().allow(''),
		degree: Joi.string().valid('박사', '석박사통합', '석사', '학석사통합', '학사').required(),
		grade: Joi.string().allow(''),
		subjectNum : Joi.string().allow(''),
		classNum: Joi.string().allow(''),
		subjectName: Joi.string(),
		credit: Joi.number().integer().min(0).max(10).required(),
		lectureHours: Joi.number().required(),
		labHours: Joi.number().required(),
		classTime: Joi.string().allow(''),
		mon: Joi.array().items(Joi.array().items(Joi.number()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
		tue: Joi.array().items(Joi.array().items(Joi.number()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
		wed: Joi.array().items(Joi.array().items(Joi.number()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
		thur: Joi.array().items(Joi.array().items(Joi.number()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
		fri: Joi.array().items(Joi.array().items(Joi.number()).length(2).unique((a, b) => a >= b)).unique((a, b) => a[1] >= b[0]),
		formOfClass : Joi.string().allow(''),
		roomNum : Joi.string().allow(''),
		prof: Joi.string().allow(''),
		capacity: Joi.number(),
		remark: Joi.string().allow(''),
		language : Joi.string().allow(''),
		weight: Joi.number().integer().min(1).max(10).required(),
		mustTake: Joi.boolean()
	}).required()
}).required();

const providedsubjectSchema = new Schema({
	classification: String, 
	college: String, 
	department: String, 
	degree: {
		  type: String,
		  enum: ['박사','석박사통합','석사','학사','학석사통합']
	},
	grade: String,
	subjectNum: String,
	classNum: String,
    subjectName: {
        type: String,
        default: "Unknown",
    },
    credit: {
        type: Number,
        required: true
    },
	lectureHours: {
		 type: Number,
		 required: true
	},
	labHours: {
		 type: Number,
		 required: true
	},
    mon: {
        type: [[Number]],
    },
    tue: {
        type: [[Number]],
    },
    wed: {
        type: [[Number]],
    },
    thur: {
        type: [[Number]],
    },
    fri: {
        type: [[Number]],
    },
	formOfClass: String,
	roomNum: String,
	prof: String,
	capacity: Number,
	remark: String,
	language: String,
    weight: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    mustTake: {
        type: Boolean,
        default: false
    }
});

const ProvidedSubject = mongoose.model("ProvidedSubject", providedsubjectSchema);

const validateSubjectFull = (subject) => {
	const { error } = subjectSchemaFull.validate({subject})
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	}
}

async function main() {
	for(let subject of newData) {
		validateSubjectFull(subject); // OK!
		const ps = new ProvidedSubject(subject);
		await ps.save();
	}
}

const mongodbURL = process.env.MONGODB_URL;

// connect to mongoose
mongoose
    .connect(mongodbURL)
    .then((result) => {
        if (process.env.MODE === "SEED")
            console.log("SEEDMongoose connection success");
    })
    .catch((error) => {
        if (process.env.MODE === "SEED")
            console.log("SEEDMongoose connection failed", error);
    });


main()
	.then( () => {
		console.log('Success');
	})
	.catch( (e) => {
		console.log(e);
		console.log('Failure');
	})