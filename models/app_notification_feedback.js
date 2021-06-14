const mongoose = require('mongoose');

// App Notification Information Schema
const appNotificationFeedbackSchema = mongoose.Schema({

	notificationid:{
		type: String,
		unique:true,
		required:true
	},

	email:{
		type: String,
		required: true
	},

	predicted:{
		type: String
	},

	feedback:{
		type: String
	}
});

const AppNotificationFeedback = module.exports = mongoose.model('appNotificationFeedback', appNotificationFeedbackSchema);


// Add notification feedback
module.exports.addNotificationFeedback = (appNotificationFeedback, callback) => {
	AppNotificationFeedback.create(appNotificationFeedback, callback);
}



// get the feedbacks by the email

module.exports.getNotificationFeedbacks = (email, callback) => {
	AppNotificationFeedback.find({ email: email}, callback);
}


// Feedback Count

module.exports.getNotificationFeedbacksCount = (email, callback) => {
	AppNotificationFeedback.count({ email: email}).count(callback);
}