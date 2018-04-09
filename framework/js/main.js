/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
var mainApp = angular.module('mainApp',["ui.router"]);

mainApp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    "use strict";
    
    $urlRouterProvider.otherwise('/login');
    
    var states = [
        {name: 'login', url: '/login', component: 'login'},
        {name: 'home', url: '/dashboard/home', component: 'home'},
        
        //{name: 'home.plantation', url: '/{plantationID}', component: 'plantation'},
        {name: 'home.admin', url: '/admin', component: 'admin'}
        
    ];
    
    // Loop over the state definitions and register them
    states.forEach(function(state) {
        $stateProvider.state(state);
    });
    
}]);