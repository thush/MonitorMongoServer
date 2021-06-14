const mongoose = require('mongoose');

// Guardian Information Schema
const instagramMonitoringUsersSchema = mongoose.Schema({
	email:{
		type: String,
		required: true
	},
	username:{
		type: String,
		required: true
	},
	userid:{
		type: String,
		required: true
	}
});

instagramMonitoringUsersSchema.index({ email: 1, username: 1 }, { unique: true });

const InstagramMonitoringUsers = module.exports = mongoose.model('instagram_monitoring_user', instagramMonitoringUsersSchema);


// Add Instagram Monitoring User
module.exports.addInstagramMonitoringUser = (instagramMonitoringUser, callback) => {
	InstagramMonitoringUsers.create(instagramMonitoringUser, callback);
}

// Check How many a Guardian is monitoring

module.exports.numberOfCurrentlyMonotoring = (email, callback) => {
	InstagramMonitoringUsers.count({ email: email }).count(callback);
}


// get the instagram users an email is monitoring

module.exports.getMonitoringUsers = (email, callback) => {
	InstagramMonitoringUsers.find({ email: email}, callback);
}


//check if the user is monitoring already

module.exports.isAlreadyMonitoring = (email,username,callback) => {
	InstagramMonitoringUsers.count({ email: email,username:username}).count(callback);
}

