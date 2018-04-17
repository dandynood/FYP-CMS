/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('dashboard', {
    templateUrl: 'template/dashboard.html',
    bindings: { plantations: '<' },

    controllerAs: "model",
    //Controller for dashboard nav bar
    controller: function ($scope, $state, $cookies, principle) {
        "use strict";
        var self = this;
        console.log(self);
        this.logout = function () {
            $cookies.remove("user");
            principle.getIdentity(true);
            $state.go('login');
        };
    }

});
