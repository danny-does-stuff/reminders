angular.module('reminder', [])
.controller('MainCtrl', ['$scope','$http', function($scope,$http){

  $scope.timeUnits = ['minute', 'hour', 'day', 'week'];
  $scope.notice = '';

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

  var date = new Date();

  $scope.addReminder = function (reminder) {

    console.log('what: ', dateAdd(date.yyyymmdd(), reminder.timeUnit, reminder.time));

    reminder.username = '';
    reminder.todo = '';
    reminder.time = '';
    reminder.timeUnit = '';

    //if call succeeded,
    $scope.notice = 'Reminder added!';
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
