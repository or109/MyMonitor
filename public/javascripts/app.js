var monitorApp = angular.module('monitorApp', ['ui.bootstrap', 'ngRoute', 'monitorControllers']);

/*
monitorApp.value('severity', function(number){
		var lbl = '';
		if (number <= 2){
			lbl='important';
		}
		else if(number == 3){
			lbl='warning';
		}
		else{
		lbl='success';
		}
		  return lbl;
	});

monitorApp.filter('lbl', function(severity){
      return function(number) {
        return severity(number);
      };
    });
*/
monitorApp.filter('truncate', function(){
		return function(text, length, end){
			if (isNaN(length))
			length = 10;
			
			if (end === undefined)
			end = "...";
			if (text){
				if (text.length <= length || text.length - end.length <= length)
				{
					return text;
				}
				else
				{
					return String(text).substring(0, length-end.length) + end;
				}
			}
			else{
				return "";
			}
		}
	});
	
monitorApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/transactions', {
        templateUrl: 'TranList.html',
        controller: 'transCtrl'
      }).
      when('/transactions/:id', {
        templateUrl: 'Tran.html',
        controller: 'tranCtrl'
      }).
	  when('/about', {
        templateUrl: 'About.html',
        controller: 'aboutCtrl'
      }).
	  when('/statistics', {
        templateUrl: 'Statistics.html',
        controller: 'statsCtrl'
      }).
      otherwise({
        redirectTo: '/transactions'
      });
  }]);
