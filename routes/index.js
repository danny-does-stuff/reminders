var express = require('express');
var router = express.Router();
var mongo = require('../mongo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { root: 'public' });
});

/**
* Adds time to a date. Modelled after MySQL DATE_ADD function.
* Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
*
* date  Date to start with
* interval  One of: year, quarter, month, week, day, hour, minute, second
* units  Number of units of the given interval to add.
*/
function dateAdd(date, interval, units){
var ret = new Date(date); //don't change original date
  var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
  switch(interval.toLowerCase()) {
  case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
  case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
  case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
  case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
  case 'day'    :  ret.setDate(ret.getDate() + units);  break;
  case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
  case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
  case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
  default       :  ret = undefined;  break;
}
return ret;
}

module.exports = function(io) {
	io.on('connection', function(socket) {
		console.log('user connected');
		// mongo.addReminder({user: 'Danny', text: 'This is a test reminder', time: new Date('2017-04-10').toISOString()});

		socket.on('login', function(username) {
			socket.username = username;
			var loginMessage = `user logged in: '${socket.username}'`;
			console.log(loginMessage);
			socket.emit('logged in', loginMessage);
		});

		socket.on('add reminder', function(reminder) {
			var response = {};
			if (socket.username) {
				var mongoReminder = {
					user: socket.username,
					text: reminder.todo,
					time: dateAdd(new Date(), reminder.timeUnit, reminder.time).toISOString()
				}

				mongo.addReminder(mongoReminder);
				response.success = true;
				response.message = 'Reminder created for ' + socket.username;
			} else {
				response.success = false;
				response.message = 'Must be signed in to add reminder';
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
