/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('login', {
    templateUrl: 'template/login.html',

    //Controller for login
    controller: function ($scope, $state, $http, $cookies) {
        "use strict";

        this.loginInput = {};
        $scope.errorMsg = '';
        
        this.login = function () {
            var str = {
                username: encodeURIComponent(this.loginInput.username),
                password: encodeURIComponent(this.loginInput.password)
            };
           
            console.log(str);
            $http({
                    method: 'POST',
                    url: 'php/login.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        $scope.errorMsg = 'Either the username or password is incorrect';
                    } else {
                        console.log(response.data);
                        $cookies.putObject('userID',response.data.userID);
                        $cookies.putObject('username',response.data.username);
                        $cookies.putObject('firstName',response.data.firstName);
                        $cookies.putObject('lastName',response.data.lastName);
                        $cookies.putObject('phoneNumber',response.data.phoneNumber);
                        $cookies.putObject('email',response.data.email);
                        $cookies.putObject('roleType',response.data.roleType);
                        $state.go('dashboard.home');
                    }
                });
        };

    }

});
