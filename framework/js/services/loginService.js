/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp')

.factory('loginService', ['$q', '$http', '$timeout', 
    function ($q, $http, $timeout) {
        "use strict";
        var identity,
            autheticated = false;
        
        return {
            isIdentityResolved: function() {
                return angular.isDefined(identity);
            },
            
            isAuthenticated: function() {
                return autheticated;
            },
            
            isInRole: function(role){
                if(!autheticated || !identity.roles) {return false;}
                
                return identity.roles.indexOf(role) !== -1;
            },
            
            isInAnyRole: function(roles){
                var i;
                if (!autheticated || !identity.roles) {return false;}
                
                for(i=0;i<roles.length;i++){
                    if(this.isInRole(roles[i])) {return true;}
                }
                
                return false;
            },
            
            authenticate: function(ident){
                identity = ident;
                autheticated = (ident !== null);
                
                if (identity){
                    localStorage.setItem("demo.identity", angular.toJson(ident));
                }
                else {localStorage.removeItem("demo.identity");}
            }
              
        };
}]);
