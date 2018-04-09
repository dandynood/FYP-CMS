/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
var mainApp = angular.module('mainApp',["ui.router"]);

mainApp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    "use strict";
    
    $urlRouterProvider.otherwise('/login');
    
    var states = [
        {name: 'login', url: '/login', component: 'login'},
        {name: 'dashboard', url:'/dashboard', templateUrl:'template/dashboard.html', redirectTo: 'dashboard.home'},
        
        {name: 'dashboard.home', url: '/home', component: 'home'},
        {name: 'dashboard.plantation', url: '/{plantationID}', component: 'plantation'},
        {name: 'dashboard.admin', url: '/admin', component: 'admin'}
        
    ];
    
    // Loop over the state definitions and register them
    states.forEach(function(state) {
        $stateProvider.state(state);
    });
    
}]);


mainApp.run(['$rootScope', '$state', function($rootScope, $state) {

    "use strict";
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params, {location: 'replace'});
      }
    });
}]);