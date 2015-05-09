// create a module for the controllers
var monitorControllers = angular.module('monitorControllers',[]);

// settings of the module
 monitorControllers.config(function($provide){
	// constant array for displaying severity classes (severity[3] == 'warning')
 	$provide.constant('severity', ['important','imporatant','important','warning','success']);
 });


 
// controller for the nav on top
//------------------------------
monitorControllers.controller('navCtrl', function($scope, $location, $routeParams){
	// init the list of pages in the nav
	$scope.list = [{"title":"Transactions", "link":"/transactions", "icon": "icon-list", "class": null}, 
				   {"title":"Statistics", "link":"/statistics", "icon": "icon-globe", "class": null}, 
				   {"title":"About", "link":"/about", "icon": "icon-user", "class": null}];
	
	// color the current page in the nav (set to active)
	$scope.navClass = function(li){
		if ($location.path().substr(0, li.length) == li ){
			return "active";
		}
		else{
			return "";
		}
	};
}); 
 
// controller for the Transactions list page
//------------------------------------------
monitorControllers.controller('transCtrl', function ($rootScope, $scope, $filter, $modal, $http, severity) {
  
  $scope.severityProp = [{name: 'Info', value: 1, order:0}, 
					     {name: 'Error', value: 2, order:2}, 
					     {name: 'Warning', value:4, order:1}];
  $scope.statusProp = [{name: 'Running', value: 1, order:0}, 
					   {name: 'Waiting', value: 2, order:1}, 
					   {name: 'Completed', value:4, order:3},
					   {name: 'Stopped', value:8, order:2}];
  
  // init the date input
  $scope.minTime = new Date();
  $scope.minTime.setDate($scope.minTime.getDate()-30);
  $scope.fromTime = new Date();
  $scope.fromTime.setDate($scope.fromTime.getDate()-1);
  $scope.currTime = new Date();
  $scope.toTime = new Date();
  
  $scope.rowsSelected = 50;
  $scope.rows = [50,100,200,500,1000];
  $scope.loading = false;
  
  $scope.loadTrans = function(){
	  var started = new Date().getTime();
	  var operation = '';
	  var consumer = '';
	  var severity = '';
	  var status = '';
	  var rowsQuery = '&rows=' + $scope.rowsSelected;
	  var sumSeverity = Number($scope.severityProp[0].value) + 
						Number($scope.severityProp[1].value) + 
						Number($scope.severityProp[2].value);

	  var sumStatus = 	Number($scope.statusProp[0].value) + 
						Number($scope.statusProp[1].value) + 
						Number($scope.statusProp[2].value) + 
						Number($scope.statusProp[3].value);
						
		$scope.sumSeverity = sumSeverity;
		$scope.sumStatus = sumStatus;
						
	// Logging the status and severity to be sent
	console.log('Severity:' + sumSeverity + ' ' + angular.toJson($scope.severityProp));
	console.log('Status:' + sumStatus + ' ' + angular.toJson($scope.statusProp));
	  
	  if(sumSeverity < 7 && sumSeverity > 0){
		severity = '&severity=' + sumSeverity;
	  }
	  if(sumStatus < 15 && sumStatus > 0){
		status = '&status=' + sumStatus;
	  }
	  
	  if($scope.opSelected){
		operation = '&operation=' + $scope.opSelected.ID;
		$scope.cSelected = undefined;
	  }
	  if($scope.cSelected){
		consumer = '&consumer=' + $scope.cSelected.ID;
		$scope.opSelected = undefined;
	  }
	  $scope.loading = true;
	  // get trans data from server
	  $http.get('trans.json?from=' + $filter('date')($scope.fromTime, 'dd/MM/yy HH:mm') + '&to=' + $filter('date')($scope.toTime, 'dd/MM/yy HH:mm') + operation + consumer + severity + status + rowsQuery).success(function(data) {
		$scope.trans = data;
		$scope.responseTime = new Date();
		$scope.timeElapsed = $scope.responseTime.getTime() - started;
		$scope.loading = false;
	  });
  };
  
  // initial load
  $scope.loadTrans();

  // get operations data from server
  $http.get('operations.json').success(function(data) {
	$rootScope.operations = data;
  });
  // get consumers data from server
  $http.get('consumers.json').success(function(data) {
	$rootScope.consumers = data;
  });
  
  //$scope.opSelected = undefined;
  //$scope.selected = {operation: undefined};

  // init the trans header
  //----------------------
  $scope.header = [{"name": "num", "display": "#"},{"name": "desc", "display": "Operation"},{"name": "provider", "display": "Provider"},{"name": "mep", "display": "MEP"},{"name": "consumer", "display": "Consumer"},{"name": "objkey", "display": "Objkey"},{"name": "status", "display": "Status"},{"name": "updated", "display": "Updated"},{"name": "id", "display": "Details"}];

  // sorting vars and functions
  //---------------------------
  $scope.order = 'updated'; 
  $scope.reverse = true;
  
  $scope.setOrder = function(column){
		if (column == 'num') return;
		
		if ($scope.order == column){
			$scope.reverse = !$scope.reverse;
		}
		else
		{
			$scope.order = column; 
			$scope.reverse = false;
		}
	 };

  // put the severity array in scope for displaying severity colors
  $scope.severity = severity;
  
// ng-class functions
//-------------------	 
  
  $scope.filterClass = function(column){
	var cls = "";
	
	if (column == 'num') return cls;
	
	if ($scope.order == column){
		if ($scope.reverse){
			cls = "icon-chevron-down icon-white pull-right";
		}
		else{
			cls = "icon-chevron-up icon-white pull-right";
		}
	}
	return cls;
  };

  $scope.mepIcon = function(mep){
		var icon ='';
		if(mep == 'in-out'){
			icon = 'refresh'
		}else if(mep == 'out'){
			icon = 'arrow-right';
		}else if(mep == 'in'){
			icon = 'arrow-left';
		}
		return icon;
	 };

 // single tran modal
 //------------------
  $scope.open = function (id) {
	// get tran data from server
	$http.get('tran.json?id=' + id).
		success(function(data) {
		        $scope.tran = data;
				
			var modalInstance = $modal.open({ 
			templateUrl: 'TranModal.html', 
			controller: singleTranCtrl,
			resolve: { 	tran: function(){return $scope.tran},
					    root: function (){return $scope.tran[0]; 
					 } 
				 }
			});
		});
	  };

});

// controller for the singleTran modal
//------------------------------------
var singleTranCtrl = function ($scope, $modalInstance, tran, root, severity) {
  	$scope.severity = severity;
	$scope.tran = tran;
	$scope.root = root;
	$scope.close= function () {
		$modalInstance.dismiss('cancel'); 
	};
};

// controller for the singleTran page
//------------------------------------
monitorControllers.controller('tranCtrl', function ($scope, $http, $routeParams, severity) {
	
	$scope.id = $routeParams.id;
  	$scope.severity = severity;
	
	// get sub services from server
	$http.get('subServices.json?id=' + $scope.id).success(function(data) {
                $scope.services = data;			
		});

	// get all tran events (from all levels) from server
	$http.get('tran.json?id=' + $scope.id).success(function(data) {
                $scope.tran = data;			
		});

});

// controller for the about page
//------------------------------
monitorControllers.controller('aboutCtrl', function($scope){
	// init the data for members
	$scope.members = [{"firstName":"Yoel", "lastName":"Fialkoff"},{"firstName":"Or", "lastName":"Mantzur"},{"firstName":"Ohad", "lastName":"Muchnik"},{"firstName":"Arel", "lastName":"Rabinowitz"},{"firstName":"Sasha", "lastName":"Nafyodov"},{"firstName":"Netanel", "lastName":"Sabas"}];
});

// controller for the Statistics page
//------------------------------------
monitorControllers.controller('statsCtrl', function($scope, $http){
	// get the statistics data from server
	$http.get('stats.json').success(function(data) {
                $scope.stats = data;			
		});
});