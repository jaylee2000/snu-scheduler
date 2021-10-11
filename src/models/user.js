const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	}
});

UserSchema.plugin(passportLocalMongoose); // Add username, password fields

const User = mongoose.model('User', UserSchema);

module.exports = { User, UserSchema };