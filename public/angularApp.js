angular.module('reminder', [])
.controller('MainCtrl', ['$scope','$http', function($scope,$http){

  $scope.timeUnits = {
    'minute': 'minute(s)',
    'hour': 'hour(s)',
    'week': 'week(s)'
  };
  

}]);
