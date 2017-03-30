var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { root: 'public' });
});

module.exports = function(io) {
	io.on('connection', function(socket) {
		// socket.username = 'Danny';
		console.log('user connected');
		// mongo.addReminder({user: 'Danny', text: 'This is a test reminder', time: new Date('2017-04-10').toISOString()});

		socket.on('login', function(username) {
			socket.username = username;
		});

		socket.on('add reminder', function(reminder) {
			if (socket.username) {
				mongo.addReminder(reminder);
				var response = 'success';
			} else {
				var response = 'must be signed in to add reminder';
			}
			socket.emit('add reminder response', response);
		});

		setInterval(function() {
			if (!socket.username) {
				return
			}
			mongo.getActiveReminders(socket.username, function(err, reminders) {
				if (err) {
					console.log(err);
				} else {
					if (reminders.length > 0) {
						console.log('reminders comin', reminders);
						socket.emit('reminder time', reminders);
					}
				}
			});
		}, 1000);
	});

	return router;
}
