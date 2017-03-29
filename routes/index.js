var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { root: 'public' });
});

module.exports = function(io) {
	io.on('connection', function(socket) {
		socket.username = 'Danny';
		console.log('user connected');
		mongo.addReminder({user: 'Danny', text: 'This is a test reminder', time: new Date('2017-04-10').toISOString()});

		socket.on('new reminder', function(reminder) {
			mongo.addReminder(reminder);
		});

		setInterval(function() {
			if (socket.username) {
				mongo.getActiveReminders(socket.username, function(reminders) {
					socket.emit('reminder time', reminders);
				});
			}
		}, 1000);
	});

	return router;
}
