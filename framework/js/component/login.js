/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('login', {
    templateUrl: 'template/login.html',

    //Controller for login
    controller: function ($scope, $state) {
        "use strict";
        $scope.text = "hello";
        $scope.login = function(){
            console.log("hi");
            $state.go('dashboard.home');
        };
        
    }

});
