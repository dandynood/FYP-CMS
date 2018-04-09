/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('home', {
    templateUrl: 'template/home.html',

    //Controller for login
    controller: function ($scope) {
        "use strict";
        $scope.text = "hello";
    }

});
