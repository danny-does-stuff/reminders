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
  	if (response == 'success') {
  		$scope.notice = 'Reminder added!';
  	} else {
  		$scope.notice = response;
  	}
  });




  $scope.timeUnits = ['second', 'minute', 'hour', 'day', 'week'];
  $scope.notice = '';

//I don't think we need this
  Date.prototype.yyyymmdd = function() {
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
  };

  $scope.login = function(username) {
  	socket.emit('login', username);
  }

  $scope.addReminder = function (reminder) {
    socket.emit('add reminder', {
    	user: reminder.username,
    	text: reminder.todo,
    	time: dateAdd(new Date(), reminder.timeUnit, reminder.time).toISOString()
    });

    reminder.todo = '';
    reminder.time = '';
  };

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




}]);
