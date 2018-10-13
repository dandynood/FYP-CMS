/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('dashboard', {
    templateUrl: 'template/dashboard.html',
    bindings: {
        plantations: '<',
        allConditionLevels: '<',
        optimumLevels: '<',
        recentNotf: '<',
        test: '<'
    },

    controllerAs: "model",
    //Controller for dashboard nav bar
    controller: function ($scope, $state, $stateParams, $interval, principle, $sessionStorage, $timeout, notificationService) {
        "use strict";
        var self = $scope.model;

        self.$onInit = function () {
            var i;
            $scope.recentNotf = self.recentNotf;
            $scope.alreadyMarkRead = false;

            //console.log($scope.recentNotf);
            if ($scope.recentNotf !== undefined) {
                for (i = 0; i < $scope.recentNotf.length; i++) {
                    $scope.recentNotf[i].datetime = new Date($scope.recentNotf[i].datetime);
                }
                $scope.recentNotfLength = $scope.recentNotf.length;
            }

            $scope.test = self.test;

            $scope.user = $sessionStorage.user;

            $scope.checkAdmin = function () {
                return $scope.user.roleType === "Admin";
            };

            $scope.logout = function () {
                $scope.user = undefined;
                delete $sessionStorage.user;
                principle.getIdentity(true);
                $state.go('login');
            };

            //console.log($scope.checkAdmin());

            $scope.removeRecentNotf = function () {
                if (!$scope.alreadyMarkRead || $scope.recentNotf === undefined) {
                    $timeout(function () {
                        var promise = notificationService.deleteRecentNotfForUser();
                        promise.then(function (msg) {
                            if (msg === "success") {
                                $scope.recentNotfLength = 0;
                                $scope.alreadyMarkRead = true;
                            }
                        });
                    }, 1000);
                } else {
                    console.log("already read");
                }
            };
            
            $scope.operationalAlerts = notificationService.getOperationalAlerts();
            
            $scope.formatEditMsg = function(text){
                if(text){
                    return text.split(" <ol>",1)[0];
                }
            };

        };

        $scope.clock = new Date();
        $interval(function () {
            $scope.clock = new Date();
        }, 1000);
    }

});
