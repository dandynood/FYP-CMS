/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
var myApp = angular.module('hellogalaxy',["ui.router"]);


myApp.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    "use strict";
    
    $urlRouterProvider.otherwise('/hello');
    
    var helloGalaxy = {
        name: 'hello',
        url: '/hello',
        component: 'hello'
    },
        
    peopleState = {
        name: 'people',
        url: '/people',
        component: 'people',
        resolve: {
            people: function(PeopleService){
                console.log(PeopleService.getDummyPeople());
                return PeopleService.getDummyPeople();
            }
        }
    },
    
    personState = {
        name: 'people.person',
        url: '/{personId}',
        component: 'person',
        resolve: {
            person: function(people, $stateParams){
                return people.find(function(person){
                    return person.id === $stateParams.personId;
                });
            }
        }
    };
    
    $stateProvider.state(helloGalaxy);
    $stateProvider.state(peopleState);
    $stateProvider.state(personState);
    
}]);
    
myApp.component('hello',{
    template: '<h3>{{$ctrl.greeting}} Solar System!</h3>' +
              '<button class="btn btn-primary ng-click="$ctrl.toggleGreeting()">Toggle greeting</button>',
    
    controller: function(){
        
        "use strict";
        this.greeting = 'hello';
        
        this.toggleGreeting = function(){
            this.greeting = (this.greeting === 'hello')?'whats up':'hello';
        };
    }
});

myApp.component('people',{
    binding: { people: '<' },
    
    template: '<h3>Some people:</h3>' +
    '<ul>' +
    '   <li data-ng-repeat="person in $ctrl.people">' +
    '       <a data-ui-sref="person({personId: person.id})>' +
    '           {{person.name}}' +
    '       </a>' +
    '   </li>' +
    '</ul>',
    
    controllerAs: "model",
    controller: function($scope) {
      "use strict";
    var model = $scope.model;
    console.log(model);
  }
    
});

myApp.component('person',{
    binding: { person: '<'},
    
    template: '<h3>A person!</h3>' +
  
            '<div>Name: {{$ctrl.person.name}}</div>' +
            '<div>Id: {{$ctrl.person.id}}</div>' +
            '<div>Company: {{$ctrl.person.company}}</div>' +
            '<div>Email: {{$ctrl.person.email}}</div>' +
            '<div>Address: {{$ctrl.person.address}}</div>' +
            
            '<button data-ui-sref="people">Close</button>'
});

             

