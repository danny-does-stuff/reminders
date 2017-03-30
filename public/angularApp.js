angular.module('reminder', [])
.controller('MainCtrl', ['$scope','$http', function($scope,$http) {

  /*********************
	SOCKET LISTENERS
  *********************/
  var socket = io();

  socket.on('reminder time', function(reminders) {
    console.log(reminders);
    var text;
  	if (reminders.length == 1) {
  		var reminder = reminders[0];
  		text = `Reminder for ${reminder.user}:\n\n${reminder.text}`;
  	} else {
		text = `Some reminders for ${reminders[0].user}:\n\n`;
		reminders.forEach((reminder) => {
			text += `${reminder.text}\n`;
		});
  	}
  	alert(text)
  });

  socket.on('add reminder response', function(response) {
  	if (response.success) {
	    $scope.newReminder.todo = '';
	    $scope.newReminder.time = '';
  	}

  	$scope.notice = response.message;
  });




  $scope.timeUnits = ['second', 'minute', 'hour', 'day', 'week'];
  $scope.notice = '';

//I don't think we need this
 /* Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var hh = this.getHours();
    var mi = this.getMinutes();
    var ss = this.getSeconds();

    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd].join('-') + ' ' +
           [(hh>9 ? '' : '0') + hh,
            (mi>9 ? '' : '0') + mi,
            (ss>9 ? '' : '0') + ss].join(':');
  };*/

  $scope.login = function(username) {
  	socket.emit('login', username);
  }
  socket.emit('login', 'Danny');
  $scope.addReminder = function (reminder) {
  	//remove username from reminder in html
    socket.emit('add reminder', reminder);
  };

}]);
