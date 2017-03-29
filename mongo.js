var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reminders');
require('./models/Reminders');
var Reminder = mongoose.model('Reminder');

function add(reminder) {
	console.log('adding reminder ' + reminder);
	var reminder = new Reminder(reminder);
	reminder.save(function(err, reminder) {
		if(err) {
			console.log(err);
			return next(err);
		}
		return reminder;
	});
}

function getActiveReminders(username, cb) {
	Reminder.find({user: username, time: { $lt: new Date().toISOString() }}, function(err, reminders) {
		console.log(reminders);
	});
}

module.exports = {
	addReminder: add,
	getActiveReminders: getActiveReminders
}