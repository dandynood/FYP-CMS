/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('dashboard', {
    templateUrl: 'template/dashboard.html',
    bindings: {
        plantations: '<',
        allConditionLevels: '<',
        optimumLevels: '<',
        test: '<'
    },

    controllerAs: "model",
    //Controller for dashboard nav bar
    controller: function ($scope, $state, $stateParams, $interval, principle, $sessionStorage) {
        "use strict";
        var self = $scope.model;

        self.$onInit = function () {
            //console.log(self.plantations);
            //console.log(self.allConditionLevels);
            //console.log(self.optimumLevels);
            //console.log(self.test);
            
            $scope.user = $sessionStorage.user;

            $scope.checkAdmin = function () {
                return $scope.user.roleType==="Admin";
            };

            $scope.logout = function () {
                $scope.user = undefined;
                delete $sessionStorage.user;
                principle.getIdentity(true);
                $state.go('login');
            };
            
            //console.log($scope.checkAdmin());

        };

        $scope.clock = new Date();
        $interval(function () {
            $scope.clock = new Date();
        }, 1000);
    }

});
