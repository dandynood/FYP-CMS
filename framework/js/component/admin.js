/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('admin', {
    templateUrl: 'template/admin.html',

    bindings: {
        users: '<',
        plantations: '<'
    },

    //Controller for login
    controller: function ($scope, adminService) {
        "use strict";
        var self = this;

        self.$onInit = function () {
            $scope.users = self.users;
            $scope.plantations = self.plantations;
            
            $scope.getUserDetails = function(username){
                $scope.individualUser = {};
                var i;
                for(i=0;i<$scope.users.length;i++){
                    if($scope.users[i].username === username){
                        $scope.individualUser = $scope.users[i];
                        break;
                    }
                }              
            };
            
            $scope.getPlantationDetails = function(id){
                $scope.individualPlantation = {};
                var i;
                for(i=0;i<$scope.plantations.length;i++){
                    if($scope.plantations[i].plantationID === id){
                        $scope.individualPlantation = $scope.plantations[i];
                        break;
                    }
                }
            };          
        };


        $scope.addUser = function (user) {
            adminService.registerUser(user);
        };
    }

});
