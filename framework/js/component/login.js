/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('login', {
    templateUrl: 'template/login.html',

    //Controller for login
    controller: function ($scope, $state, $http) {
        "use strict";

        this.loginInput = {};
        this.errorMsg = '';

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
                        this.errorMsg = 'Either the username or password is incorrect';
                    } else {
                        $state.go('dashboard.home');
                    }
                });
        };

    }

});
