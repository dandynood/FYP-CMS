/*jslint white:true */
/*global angular */
/*global moment */
/*jslint plusplus:true*/
angular.module('mainApp').component('login', {
    templateUrl: 'template/login.html',

    //Controller for login
    controller: function ($scope, $state, $http, principle) {
        "use strict";

        this.loginInput = {};
        $scope.errorMsg = '';

        this.login = function () {
            var str = {
                username: encodeURIComponent(this.loginInput.username),
                password: encodeURIComponent(this.loginInput.password)
            };

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
                        principle.authenticate(response.data);
                        
                        if ($scope.returnToState) {
                            $state.go($scope.returnToState.name, $scope.returnToStateParams);
                        } else {
                            $state.go('dashboard.home');
                        }
                    }
                });
        };
        
        $scope.changeBackgroundImgOnTime = function(){
            var date = new Date(), hour = moment(date).hour();
            //if it's night time, between midnight to 6am, and 7pm to 11pm
            //change to the night background, login-background-2
            if((hour >= 0 && hour <= 6) || (hour >= 19 && hour <= 23)){
                return "night";
            } else {
                //else put the default login-background
                return "day";
            }
        };
        
    }

});
