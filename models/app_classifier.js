const mongoose = require('mongoose');

// App Notification Information Schema
const appClassifierSchema = mongoose.Schema({

	interceptWeight:{
		type: String,
		required: true
	},

	negativeCommentCountWeight:{
		type: String,
		required: true
	},
	negativeCommentPercentageWeight:{
		type: String,
		required: true
	},

	negativeWordPerNegativeCommentWeight:{
		type: String,
		required: true
	}
});

const AppClassifier = module.exports = mongoose.model('appClassifier', appClassifierSchema);


// Update Classifier
module.exports.addClassifier = (appClassifier, callback) => 
{
	AppClassifier.create(appClassifier, callback);
}



// get All current weights

module.exports.getClassifiers = (callback) => {
	AppClassifier.find(callback);
}