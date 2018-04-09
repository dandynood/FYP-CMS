/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('hellogalaxy').service('PeopleService',function($http){
    "use strict";
    
    var service = {
        getAllPeople: function() {
            return $http.get('data/people.json', { cache: true }).then(function(resp) {
                return resp.data;
            });
        },
        
        getDummyPeople: function(){
            var list = 
                [
                    {"id":"JAM","name":"James","company":"Shell","email":"100075176@students.swinburne.edu.my","address":"75 Lorong Keranji 4A2, Tabuan Desa Indah"},
                    {"id":"HAM","name":"Hammer","company":"Lol","email":"421412@students.swinburne.edu.my","address":"612 Lorong Keranji 4A2, Tabuan Desa Indah"}

                ];
            
            
            return list;
        },
        
        getPerson: function(id) {
          function personMatchesParam(person) {
            return person.id === id;
          }

          return service.getDummyPeople().then(function (people) {
            return people.find(personMatchesParam);
          });
            
        }
        
  };
    return service;
});