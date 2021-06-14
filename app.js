



var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const saltRounds = 10;

app.use(bodyParser.json());

//Connect to mongoose
mongoose.connect('mongodb+srv://test:test@cluster0.brzr6.mongodb.net/test?retryWrites=true&w=majority');
//need a database object
var db = mongoose.connection;

var NO_OF_USERS_CAN_MONITOR = 2;


Guardian =require('./models/guardian');
InstagramMonitoringUsers =require('./models/instagram_monitoring_users');
AppNotification = require('./models/app_notifications');
AppNotificationFeedback = require('./models/app_notification_feedback');
AppClassifier = require('./models/app_classifier');





//add classifier

app.post('/api/classifier/add', (req, res) => {
	var appClassifier = req.body;
	AppClassifier.addClassifier(appClassifier, (err, appClassifier) => 
	{
			if(err)
			{
				res.json({"success":"failure","message":"could not add the classifier."});
			}
			else
			{
				res.json({"success":"success","message":"Adding classifier was successful"});
			}
	});
			
});


//add notification feedback

app.post('/api/notificationfeedback/add', (req, res) => {
	var appNotificationFeedback = req.body;
	AppNotificationFeedback.addNotificationFeedback(appNotificationFeedback, (err, appNotificationFeedback) => 
	{
			if(err)
			{
				res.json({"success":"failure","message":"could not add the feedback."});
			}
			else
			{
				res.json({"success":"success","message":"Adding feedback was successful"});
			}
	});
			
});



//add notification

app.post('/api/notification/add', (req, res) => {
	var appNotification = req.body;
	AppNotification.addNotification(appNotification, (err, appNotification) => 
	{
			if(err)
			{
				res.json({"success":"failure","message":"could not add the notification."});
			}
			else
			{
				res.json({"success":"success","message":"Adding notification was successful"});
			}
	});
			
});





//Register Guardian into CybersafetyApp

app.post('/api/guardian/register', (req, res) => {
	var guardian = req.body;
	var email = guardian.email;
	var password = guardian.password;

	
	Guardian.checkIfGuardianExists(email, (err, count) => {
		if(err){
			res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			throw err;
		}
		if(count>0)
		{
			res.json({"success":"failure","message":"This email is already registered."});
		}
		else
		{
			var hash = bcrypt.hashSync(password, saltRounds);
			guardian.password = hash;
			Guardian.registerGuardian(guardian, (err, guardian) => {
			if(err){
				res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			}
			res.json({"success":"success","message":"Yay! Your registration was successful!"});
	});
		}
		
	});

	
});


// Guardian Log in

app.get('/api/guardian/login', (req, res) => {
	var login = req.query;
	var email = login.email;
	var password = login.password;


	Guardian.loginGuardian(email, (err, guardian) => {
		if(err)
		{
			res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			//throw err;
		}
		else
		{
			try{
				var hashFromDB = guardian[0].password;
				isMatch = bcrypt.compareSync(password, hashFromDB);
				if(isMatch == true)
				{
					res.json({"success":"success","message":"Yay! The login was successful."});
				}
				else
				{
					res.json({"success":"failure","message":"Sorry the login credentials might be wrong. Please try again."});
				}

			}catch(errr)
			{
				res.json({"success":"failure","message":"Sorry the login credentials might be wrong. Please try again."});
			}
			
		}
		
	});

	
});




// Get Notification Count

app.get('/api/notification/count', (req, res) => {
	var query = req.query;
	var email = query.email;


	AppNotification.getNotificationCount(email, (err, count) => 
	{
		if(err)
		{
			res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			//throw err;
		}
		else
		{
			res.json({"success":"success","message":count});
		}
		
	});

	
});

// Get Feedback Count

app.get('/api/feedback/count', (req, res) => {
	var query = req.query;
	var email = query.email;


	AppNotificationFeedback.getNotificationFeedbacksCount(email, (err, count) => 
	{
		if(err)
		{
			res.json({"success":"failure","message":"Something unexpected happened. Please try again."});
			//throw err;
		}
		else
		{
			res.json({"success":"success","message":count});
		}
		
	});

	
});




// Guardian autehntication token

app.get('/api/guardian/instagramAuthToken', (req, res) => {
	var req = req.query;
	var code = req.code;
	var email = req.email;
	var request = require('request');

	request.post(
	    'https://api.instagram.com/oauth/access_token',
	    { form: { client_id: '362741ea25924668af07edfb3873e3a2',
	     client_secret: 'ed14022584a2494690a6d9da21f7ee6e',
	      grant_type: 'authorization_code', 
	      redirect_uri: 'http://localhost', 
	      code:code } },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	        	res.json({"success":"success","message":"Yay! authentication was successful.","token":response.body});
	        }
	        else
	        {
	        	res.json({"success":"failure","message":"authentication was unsuccessful."});
	        }
	    }
	);
});





//Add user to InstagramMonitoringUser table

app.post('/api/guardian/instagram/useraddRequest', (req, res) => 
{
	var useraddRequest = req.body;
	var email = useraddRequest.email;
	var countRequest = useraddRequest.countRequest;	
	var data = useraddRequest.data;
	var error = 0;
	var alreadyMonitoring = [];

	function check(i)
	{
		if(i<data.length)
		{
			var username = data[i].username;
			InstagramMonitoringUsers.isAlreadyMonitoring(email, username, (err, count) => 
			{
				if(err)
				{
					if (error == 0)
						error = 1;
				}
				if(count>0)
				{
					if (error == 0)
					{
						error = 2;
						alreadyMonitoring.push(username);
					}
				}
				check(i+1);
			});
			
		}
		else
		{
			if(error == 1)
			{
				res.json({"success":"failure","message":"something bad happened, please try again"});
			}
			else if (error == 2)
			{
				res.json({"success":"failure","message":"already monitoring one of the users:"+alreadyMonitoring});
			}
			else
			{
				insertAfterCheck(0);
			}

		}
	}


	function insertAfterCheck(i)
	{
		if(i<data.length)
		{
			var temp = data[i];
			InstagramMonitoringUsers.addInstagramMonitoringUser(temp, (errr, temp) => 
			{
				if(errr)
				{
					if (error == 0)
						error = 1
				}
				insertAfterCheck(i+1);
			});
		}
		else
		{
			if(error == 1)
			{
				res.json({"success":"failure","message":"something bad happened, please try again"});
			}
			else
			{
				res.json({"success":"success","message":"monitoring request was successful"});
			}
		}
	}

	check(0);



	
});


// Guardian get monitoring users


app.get('/api/guardian/instagram/getMonitoringUsers', (req, res) => {
	var queryBody = req.query;
	var email = queryBody.email;

	InstagramMonitoringUsers.getMonitoringUsers(email, (err, users) => {
		if(err){
			res.json({"success":"failure","message":"something bad must have happened. Please try again."});
			throw err;
		}
		else
		{
			res.json({"success":"success","message":"The request was successful","users":users});
		}
		
	});

	
});




// get classifier


app.get('/api/classifier/getClassifier', (req, res) => {

	AppClassifier.getClassifiers((err, classifiers) => {
		if(err)
		{
			res.json({"success":"failure","message":"something bad must have happened. Please try again."});
			//throw err;
		}
		else
		{
			var results = [];
			var totalItem = 0.0;
			var interceptWeight = 0.0;
			var negativeCommentCountWeight = 0.0;
			var negativeCommentPercentageWeight = 0.0;
			var negativeWordPerNegativeCommentWeight = 0.0;
			for(var item of classifiers)
			{
				totalItem += 1.0;
				interceptWeight = parseFloat(interceptWeight) + parseFloat(item.interceptWeight);
				negativeCommentCountWeight = parseFloat(negativeCommentCountWeight) + parseFloat(item.negativeCommentCountWeight);
				negativeCommentPercentageWeight = parseFloat(negativeCommentPercentageWeight) + parseFloat(item.negativeCommentPercentageWeight);
				negativeWordPerNegativeCommentWeight = parseFloat(negativeWordPerNegativeCommentWeight) + parseFloat(item.negativeWordPerNegativeCommentWeight);

			}
			interceptWeight = interceptWeight/totalItem;
			negativeCommentCountWeight = negativeCommentCountWeight/totalItem;
			negativeCommentPercentageWeight = negativeCommentPercentageWeight/totalItem;
			negativeWordPerNegativeCommentWeight = negativeWordPerNegativeCommentWeight/totalItem;

			results.push({interceptWeight:interceptWeight,
						negativeCommentCountWeight:negativeCommentCountWeight,
						negativeCommentPercentageWeight:negativeCommentPercentageWeight,
						negativeWordPerNegativeCommentWeight:negativeWordPerNegativeCommentWeight});

			res.json({"success":"success","message":"The request was successful","weights":results});
		}
		
	});

	
});



// Guardian get notifications


app.get('/api/guardian/getNotifications', (req, res) => {
	var queryBody = req.query;
	var email = queryBody.email;

	AppNotification.getNotifications(email, (err, notifications) => {
		if(err){
			res.json({"success":"failure","message":"something bad must have happened. Please try again."});
			throw err;
		}
		else
		{
			var result = [];
			for(var item of notifications)
			{
				result.push({notificationid:item.notificationid,appNotificationResult:item.appNotificationResult,
					username:item.username,osn_name:item.osn_name});
			}
			res.json({"success":"success","message":"The request was successful","notifications":result});
		}
		
	});

	
});


// Guardian get feedbacks


app.get('/api/guardian/getNotificationFeedbacks', (req, res) => {
	var queryBody = req.query;
	var email = queryBody.email;
	var username = queryBody.username;

	AppNotificationFeedback.getNotificationFeedbacks(email, (err, feedbacks) => {
		if(err)
		{
			res.json({"success":"failure","message":"something bad must have happened. Please try again."});
			throw err;
		}
		else
		{
			var result = [];
			for(var item of feedbacks)
			{
				result.push({notificationid:item.notificationid,predicted:item.predicted,feedback:item.feedback});
			}
			res.json({"success":"success","message":"The request was successful","feedbacks":result});
		}
		
	});

	
});


// Guardian get monitoring count

/*
app.get('/api/guardian/instagram/getMonitoringCount', (req, res) => {
	var queryBody = req.query;
	var email = queryBody.email;

	InstagramMonitoringUsers.numberOfCurrentlyMonotoring(email, (err, count) => {
		if(err){
			res.json({"success":"failure","message":"Something unexpected happened. Please try again.","count":-1});
		}
		else
		{
			res.json({"success":"success","message":"Yay! The login was successful.","count":count});
		}
		
	});

	
});
*/



//default homepage for the api

app.get('/', function(req,res)
{
	res.send("hello world to the cybersafety app api.");
});









//Setting route for the application
app.listen(3000);
console.log('Running on port 3000...');