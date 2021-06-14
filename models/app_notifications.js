const mongoose = require('mongoose');

// App Notification Information Schema
const appNotificationSchema = mongoose.Schema({

	notificationid:{
		type: String,
		unique:true,
		required:true
	},

	email:{
		type: String,
		required: true
	},

	username:{
		type: String,
		required: true
	},
	osn_name:{
		type: String,
		required: true
	},

	postid:{
		type: String
	},

	newComments:{
		type: String
	},

	appNotificationResult:{
		type: String
	},

	lastCommentCreatedAt:{
		type: String
	},

	timeAtNotification:{
		type: String
	}
});

const AppNotification = module.exports = mongoose.model('appNotification', appNotificationSchema);


// Add notification
module.exports.addNotification = (appNotification, callback) => {
	AppNotification.create(appNotification, callback);
}



// get the notifications by the email

module.exports.getNotifications = (email, callback) => {
	AppNotification.find({ email: email }, callback);
}

// Notification Count

module.exports.getNotificationCount = (email, callback) => {
	AppNotification.count({ email: email}).count(callback);
}