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

    $scope.showDropDown = false
    $scope.list1 = [{'title': 'Lolcat Shirt'},{'title': 'Cheezeburger Shirt'},{'title': 'Buckit Shirt'}];
    $scope.list2 = [{'title': 'Zebra Striped'},{'title': 'Black Leather'},{'title': 'Alligator Leather'}];
    $scope.list3 = [{'title': 'iPhone'},{'title': 'iPod'},{'title': 'iPad'}];
    $scope.list4 = [];
    $scope.hideMe = function() {
        return $scope.list4.length > 0;
    };

    $scope.fileChanged = function(files) {
            $scope.columns = [];
            $scope.brand = "";
            $scope.excelFile = files[0];
            XLSXReaderService.readFile($scope.excelFile, $scope.showPreview).then(function(xlsxData) {
                $scope.columns = xlsxData.sheets["Full data model dump without assets"];
                $scope.brand = $scope.columns[0].Brand;
                console.log($scope.brand);
            });
    };

    $scope.update = function(){
        console.log($scope.brand.Brand);
        $scope.showDropDown = true
    }



});

App.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});