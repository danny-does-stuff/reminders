var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reminders');
require('./models/Reminders');
var Reminder = mongoose.model('Reminder');

function add(reminder) {
	var reminder = new Comment(req.body);
	reminder.save(function(err, reminder) {
		if(err) {
			return next(err);
		}
		res.json(reminder);
	});
}

function getActiveReminders(username, cb) {
	Reminder.find({user: username, time: { $lt: new Date().toISOString() }})
}

module.exports = {
	addReminder: add,   
	getActiveReminders: getActiveReminders
}