/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
var mainApp = angular.module('mainApp', ["ui.router"]);

mainApp.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    "use strict";

    $urlRouterProvider.otherwise('/login');

    var states = [
        {
            name: 'login',
            url: '/login',
            component: 'login'
        },
        {
            name: 'dashboard',
            url: '/dashboard',
            templateUrl: 'template/dashboard.html',
            redirectTo: 'dashboard.home'
        },

        {
            name: 'dashboard.home',
            url: '/home',
            component: 'home'
        },
        {
            name: 'dashboard.plantation',
            url: '/{plantationID}',
            component: 'plantation'
        },
        {
            name: 'dashboard.admin',
            url: '/admin',
            component: 'admin'
        }

    ];

    // Loop over the state definitions and register them
    states.forEach(function (state) {
        $stateProvider.state(state);
    });

}]);


mainApp.run(['$rootScope', '$state', function ($rootScope, $state, Data) {

    "use strict";
    $rootScope.$on('$stateChangeStart', function (evt, to, params) {
        $rootScope.authenticated = false;
        Data.get('session').then(function(results){
            if(results.uid){
                $rootScope.authenticated = true;
                $rootScope.uid = results.uid;
                $rootScope.name = results.name;
                $rootScope.phoneNum = results.email;
                $rootScope.email = results.email;
            } else {
                var nextUrl = to.$$route.originalPath;
                if(nextUrl !== '/login'){
                    $state.go("/login");
                }
            }
        });
        
        if (to.redirectTo) {
            evt.preventDefault();
            $state.go(to.redirectTo, params, {
                location: 'replace'
            });
        }
    });
}]);
