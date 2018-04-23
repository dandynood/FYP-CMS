/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('dashboard', {
    templateUrl: 'template/dashboard.html',

    //Controller for login
    controller: function ($scope, $state, $cookies, principle) {
        "use strict";
        this.logout = function () {
            $cookies.remove("user");
            principle.getIdentity(true);
            $state.go('login');
        };
    }

});
