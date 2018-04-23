/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('admin', {
    templateUrl: 'template/admin.html',

    //Controller for login
    controller: function ($scope) {
        "use strict";
        $scope.text = "hello";
    }

});
