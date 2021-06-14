const mongoose = require('mongoose');

// Guardian Information Schema
const guardianSchema = mongoose.Schema({
	email:{
		type: String,
		unique: true,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	age_group:{
		type: String,
		required: true
	},
	ethnicity:{
		type: String,
		required: true
	},
	gender:{
		type: String,
		required: true
	},
	instagram_access_token:{
		type: String
	},
	facebook_access_token:{
		type: String
	},
	twitter_access_token:{
		type: String
	}
});

const Guardian = module.exports = mongoose.model('guardian', guardianSchema);


// Add Guardian
module.exports.registerGuardian = (guardian, callback) => {
	Guardian.create(guardian, callback);
}

// Check if Guardian Already Exists

module.exports.checkIfGuardianExists = (email, callback) => {
	Guardian.count({ email: email }).count(callback);
}

// Guardian LogIn

module.exports.loginGuardian = (email, callback) => {
	Guardian.find({ email: email}, callback);
}


// Guardian insert Instagram token

module.exports.insertInstagramToken = (email,token, callback) => {

	var conditions = { email: email }, update = { instagram_access_token: token}, options = { multi: true };
	Guardian.update(conditions, update, options, callback);
}