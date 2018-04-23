/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('admin', {
    templateUrl: 'template/admin.html',
    
    bindings: { users: '<', plantations: '<' },

    //Controller for login
    controller: function ($scope) {
        "use strict";
        var self = this;
        
        console.log(self);
    }

});
