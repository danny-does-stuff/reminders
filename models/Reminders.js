var mongoose = require('mongoose');

var ReminderSchema = new mongoose.Schema({
	user: String,
	text: String,
	time: Date
});

mongoose.model('Reminder', ReminderSchema);
