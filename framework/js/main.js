/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/

/*define mainApp name*/
var mainApp = angular.module('mainApp', ["ui.router", "ngStorage", "chart.js", "ngAnimate", "ngTouch", "ui.bootstrap"]);
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
                //This binding is primarily used to query all the conditions and optimum levels
                //and also to stay present through the whole dashboard's and children
                //to be used when necessary
                plantations: function (plantationService) {
                    return plantationService.getAllplantations();
                },
                allConditionLevels: function (plantations, plantationService) {
                    return plantationService.getAllLevels(plantations, '2018-04-07');
                },
                optimumLevels: function (plantations, optimumLevelsService) {
                    return optimumLevelsService.getAllOptimumLevels(plantations);
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
            resolve: {
                allConditionLevels: function (allConditionLevels) {
                    return allConditionLevels;
                },
                optimumLevels: function (optimumLevels) {
                    return optimumLevels;
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
                //gets the plantation from the allLevels variable in the
                //plantationService, get by ID, this contains the conditionLevels
                plantation: function (plantationService, $stateParams) {
                    return plantationService.getPlantation($stateParams.plantationID);
                },
                //gets the optimum level of the plantation
                optimumLevels: function (optimumLevelsService, $stateParams) {
                    return optimumLevelsService.getPlantationOptimumLevels($stateParams.plantationID);
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
                //gets both plantation and the optimum levels for edit
                plantations: function (plantations, optimumLevelsService) {
                    return optimumLevelsService.getAllOptimumLevels(plantations);
                }
            }
        },
<<<<<<< HEAD

        {
            name: 'dashboard.weather',
            url: '/weather',
            component: 'weather',
            //cache: false,
=======
	
	{
            name: 'dashboard.weather',
            url: '/weather',
            component: 'weather',
>>>>>>> 08a68f40ac4705844214620cc16f40a64a8a7c2d
            data: {
                roles: ['Normal', 'Admin']
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
mainApp.run(['$rootScope', '$state', '$transitions','principle', 'authorization', function ($rootScope, $state, $transitions, principle, authorization) {

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
