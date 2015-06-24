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
    $scope.listcount = 1;
//    //$scope.list1 = [{'title': 'Lolcat Shirt'},{'title': 'Cheezeburger Shirt'},{'title': 'Buckit Shirt'}];
//    $scope.list2 = [{'title': 'Zebra Striped'},{'title': 'Black Leather'},{'title': 'Alligator Leather'}];
//    $scope.list3 = [{'title': 'iPhone'},{'title': 'iPod'},{'title': 'iPad'}];
    $scope.list4 = [];
    $scope.hideMe = function(list) {
        return $scope[list].length > 0;
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
        $scope.list1 = $scope.getList($scope.brand.Brand);
        $scope.showDropDown = true;
    };

    $scope.getList = function(brand) {
        console.log(brand);
        var tempList = [];
        for(var i=0; i < $scope.columns.length ;i++) {
            if($scope.columns[i].Brand === brand) {
                tempList.push(($scope.columns[i]["Internal Product Name"]));
            }
        }
        return tempList;
    };

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

App.directive("addDiv", function($compile){

    return function(scope , element,attrs){
            element.bind("click", function(){
                scope.listcount = scope.listcount + 1;
                var list = "list" + scope.listcount.toString();
                scope[list] = [];
                console.log(scope[list]);
                // console.log("I am in Add Div Me" + list)
                angular.element(document.getElementById("group-container")).append($compile('<div class="addGroupContainer"><h1 class="ui-widget-header">' + scope.textGroup + '</h1><div class=\"ui-widget-content\"><ol data-drop=\"true\" ng-model="'+ list + '"jqyoui-droppable=\"{multiple:true}\"> <li ng-repeat="item in '+ list +' track by $index" ng-show="item" data-drag="true" data-jqyoui-options="{revert: \'invalid\', helper: \'clone\'}" ng-model="' + list +'" jqyoui-draggable="{index: {{$index}},animate:true}">{{item}}</li><li class="placeholder" ng-hide="hideMe('+ list + ')">Add your items here</li></ol></div></div>')(scope));
            });
    };
});