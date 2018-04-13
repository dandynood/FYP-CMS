/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
var mainApp = angular.module('mainApp', ["ui.router", "ngCookies"]);

mainApp.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    "use strict";

    $urlRouterProvider.otherwise('/login');

    var states = [
        {
            name: 'login',
            url: '/login',
            component: 'login',
            data: {
                roles: []
            }
        },
        {
            name: 'dashboard',
            url: '/dashboard',
            component: 'dashboard',
            redirectTo: 'dashboard.home',
            data: {
                roles: ['Normal', 'Admin']
            }
        },

        {
            name: 'dashboard.home',
            url: '/home',
            component: 'home',
            data: {
                roles: ['Normal', 'Admin']
            }

        },
        {
            name: 'dashboard.plantation',
            url: '/{plantationID}',
            component: 'plantation',
            data: {
                roles: ['Normal', 'Admin']
            }
        },
        {
            name: 'dashboard.admin',
            url: '/admin',
            component: 'admin',
            data: {
                roles: ['Admin']
            }
        }

    ];

    // Loop over the state definitions and register them
    states.forEach(function (state) {
        $stateProvider.state(state);
    });

}]);


mainApp.run(['$rootScope', '$state', '$transitions', 'principle', 'authorization', function ($rootScope, $state, $transitions, principle, authorization) {

    "use strict";
    $transitions.onStart({
        to: 'dashboard.**'
    }, function (trans) {

        $rootScope.to = trans.to();
        $rootScope.params = trans.params();

        if (principle.isIdentityResolved()) {
            console.log("hello");
            authorization.authorize();
        }

        if (!principle.isAuthenticated()) {
            return principle.getAuthentication();
        }
    });

    $transitions.onStart({
        to: 'login'
    }, function (trans) {

        $rootScope.to = trans.to();
        $rootScope.params = trans.params();
        
        console.log("hello");
        authorization.authorize();

    });

}]);
