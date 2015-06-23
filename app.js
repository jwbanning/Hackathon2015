$(function() {
  $("#catalog").accordion();
});
var App = angular.module('drag-and-drop', ['ngDragDrop']);

    App.factory("XLSXReaderService", ['$q', '$rootScope',
        function($q, $rootScope) {
            var service = function(data) {
                angular.extend(this, data);
            };
 
            service.readFile = function(file, showPreview) {
                var deferred = $q.defer();
 
                XLSXReader(file, true, true, function(data){
                    $rootScope.$apply(function() {
                        deferred.resolve(data);
                    });
                });
 
                return deferred.promise;
            };
 
            return service;
        }
    ]);



App.controller('oneCtrl', function($scope, $timeout, XLSXReaderService) {
  $scope.list1 = [{'title': 'Lolcat Shirt'},{'title': 'Cheezeburger Shirt'},{'title': 'Buckit Shirt'}];
  $scope.list2 = [{'title': 'Zebra Striped'},{'title': 'Black Leather'},{'title': 'Alligator Leather'}];
  $scope.list3 = [{'title': 'iPhone'},{'title': 'iPod'},{'title': 'iPad'}];
  $scope.list4 = [];
  $scope.hideMe = function() {
    return $scope.list4.length > 0;
  };

	$scope.fileChanged = function(files) {
	        $scope.sheets = [];
	        $scope.excelFile = files[0];
	        XLSXReaderService.readFile($scope.excelFile, $scope.showPreview).then(function(xlsxData) {
            	$scope.sheets = xlsxData.sheets;
            	console.log($scope.sheets);
        	});

	};
});