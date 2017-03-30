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
	var query = {user: username, time: { $lt: new Date().toISOString() }};
	Reminder.find(query, function(err, reminders) {
		if (err) {
			cb(err);
		} else {
			cb(null, reminders);
			reminders.forEach((reminder) => {
				reminder.remove();
			});
		}
	});
}

module.exports = {
	addReminder: add,
	getActiveReminders: getActiveReminders
}