var express = require('express');
var router = express.Router();
var mongo = require('./mongo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { root: 'public' });
});

router.get('/test', function(req, res, next) {
	res.end('Hello there');
})

// module.exports = router;

module.exports = function(io) {
	io.on('connection', function(socket) {
		console.log('user connected');

		socket.on('new reminder', function(reminder) {
			mongo.addReminder(reminder);
		});

		setInterval(function() {
			var username = 'Danny';
			mongo.getActiveReminders(username, function(reminders) {
				socket.emit('reminder time', reminders);
			})
		}, 1000);
	});

	return router;
}
