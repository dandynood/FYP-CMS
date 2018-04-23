/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('dashboard', {
    templateUrl: 'template/dashboard.html',
    bindings: {
        plantations: '<',
        allConditionLevels: '<'
    },

    controllerAs: "model",
    //Controller for dashboard nav bar
    controller: function ($scope, $state, $cookies, $stateParams, $interval, principle, plantationService) {
        "use strict";
        var self = $scope.model;

        self.logout = function () {
            $cookies.remove("user");
            principle.getIdentity(true);
            $state.go('login');
        };

        self.checkAdmin = function () {};

        $scope.clock = new Date();
        $interval(function () { $scope.clock = new Date(); }, 1000);
    }

});
