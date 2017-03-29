var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { root: 'public' });
});

module.exports = router;

module.exports = function(io) {
	var app = require('express');
	var router = app.Router();

	io.on('connection', function(socket) {
		console.log('user connected');

		var data = {message: 'hey there'};
		socket.emit('reminder', data);
	});

	return router;
}
