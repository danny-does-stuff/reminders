angular.module('reminder', [])
.controller('MainCtrl', ['$scope','$http', '$timeout', function($scope, $http, $timeout) {
  $scope.timeUnits = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
  $scope.alerts = [];

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

  socket.on('logged in', function(message) {
  	$scope.$apply(function() {
  		$scope.alerts.push(message);
  	});
  });

  socket.on('add reminder response', function(response) {
  	$scope.$apply(function() {
	  	if (response.success) {
			    $scope.newReminder.todo = '';
			    $scope.newReminder.time = '';
	  	}
	  	
	  	$scope.alerts.push(response.message);
	});

  });


  /*********************
	 NON SOCKET STUFF
  *********************/


  $scope.login = function() {
  	socket.emit('login', $scope.username);
  }

  $scope.addReminder = function (reminder) {
  	//remove username from reminder in html
    socket.emit('add reminder', reminder);
  };

}]);
