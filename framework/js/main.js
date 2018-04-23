/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/

/*define mainApp name*/
var mainApp = angular.module('mainApp', ["ui.router", "ngCookies","chart.js"]);

/*these are the routing configuration settings*/
mainApp.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    "use strict";

    //if any other route just go to login
    $urlRouterProvider.otherwise('/login');

    //here we use angular-ui-router's style of routing pages together
    //we define states, which has names, url, and components, including any other attributes needed.
    //components are seperate js files which have defined templateUrls and controllers
    //Data.roles is used for authetication, where only certain user roles can access what page.
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
            },
            resolve: {
                plantations: function (plantationService) {
                    return plantationService.getAllplantations();
                },
                allConditionLevels: function (plantations, plantationService) {
                    return plantationService.getAllLevels(plantations);
                }
            }
        },

        {
            name: 'dashboard.home',
            url: '/home',
            component: 'home',
            data: {
                roles: ['Normal', 'Admin']
            },
            resolve:{
                allConditionLevels: function (allConditionLevels) {
                    return allConditionLevels;
                }
            }
        },
        {
            name: 'dashboard.plantation',
            url: '/{plantationID}',
            component: 'plantation',
            data: {
                roles: ['Normal', 'Admin']
            },
            resolve: {
                plantation: function (plantationService, $stateParams) {
                    return plantationService.getPlantation($stateParams.plantationID);
                }
            }
        },
        {
            name: 'dashboard.admin',
            url: '/admin',
            component: 'admin',
            data: {
                roles: ['Admin']
            },
            resolve: {
                users: function (adminService) {
                    return adminService.getAllUsers();
                },
                plantations: function (plantationService) {
                    return plantationService.getAllplantations();
                }
            }

        }

    ];

    // Loop over the state definitions and register them
    //uses the $stateProvider.state() function
    states.forEach(function (state) {
        $stateProvider.state(state);
    });

}]);


//This runs everytime you load a route or start a state/page.
mainApp.run(['$rootScope', '$state', '$transitions', 'principle', 'authorization', function ($rootScope, $state, $transitions, principle, authorization) {

    "use strict";

    //These uses angular-ui-router's $transitions service
    //Run this code onStart of loading state 'dashboard' and it's child states
    $transitions.onStart({
        to: 'dashboard.**'
    }, function (trans) {

        //use trans which has the to() function and params() function
        //trans will return the to state (destination), and url parameters.
        $rootScope.to = trans.to();
        $rootScope.params = trans.params();
        
        authorization.authorize();
    });

    //Run this code onStart of loading the login state.
    $transitions.onStart({
        to: 'login'
    }, function (trans) {

        $rootScope.to = trans.to();
        $rootScope.params = trans.params();

        //call authorize() from the authorization factory
        //check if you are already logged in so you can proceed immediately to dashboard.
        authorization.authorize();

    });

}]);
