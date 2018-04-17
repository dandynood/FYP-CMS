/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/

/*use the same mainApp name from main.js*/
/*this factory is resposible for checking the current logged in user, if they exist
or they are autheticated or not*/
angular.module('mainApp').factory('principle', ['$q', '$http', '$cookies', '$state',
    function ($q, $http, $cookies, $state) {
            "use strict";

            //identity holds user object from cookie
            //autheticated checks if you are logged in or not
            var identity,
                autheticated = false;

            //return functions for use
            return {
                
                //true if identity is defined, else false
                isIdentityResolved: function () {
                    return angular.isDefined(identity);
                },
                
                //return autheticated var
                isAuthenticated: function () {
                    return autheticated;
                },

                //check if given role, is the same as the identity object's roleType attribute
                isInRole: function (role) {
                    if (!autheticated || !identity.roleType) {
                        return false;
                    }

                    return identity.roleType === role;
                },

                //given an array of roles from data.roles in main.js states
                //call isInRole in for loop for each role in roles
                isInAnyRole: function (roles) {
                    var i;
                    if (!autheticated || !identity.roleType) {
                        return false;
                    }

                    for (i = 0; i < roles.length; i++) {
                        if (this.isInRole(roles[i])) {
                            return true;
                        }
                    }

                    return false;
                },
                
                //given a defined iden object, assign identity
                //assign autheticated if iden is defined
                //if iden is defined, put the object into ngCookies or remove if not
                authenticate: function (iden) {
                    identity = iden;
                    autheticated = iden !== undefined && iden !== null;

                    if (iden) {
                        $cookies.putObject("user", iden);
                    } else {
                        $cookies.remove("user");
                    }
                },

                //Go to login state to get authentication
                getAuthentication: function () {
                    $state.go('login');
                },

                //complex function to determine identity's identity and what to do
                //use $q.defer() to mark this task to be finished in the future
                getIdentity: function (force) {
                    var deferred = $q.defer(),
                        self = this,
                        str;

                    //if given force, reset identity
                    if (force === true) {
                        identity = undefined;
                    }
                    
                    //if identity is defined, resolve the task (deferred) with identity as finished
                    //return the promise with identity
                    if (angular.isDefined(identity)) {
                        deferred.resolve(identity);

                        return deferred.promise;
                    }
                    
                    //if the cookie is defined but no identity
                    //use $http to update the cookie, lookup via userID with getIdentity.php
                    //on success assigned identity object and authenticated with true
                    //after all resolve and return promise
                    if ($cookies.getObject("user")) {
                        str = {
                            userID: encodeURIComponent($cookies.getObject("user").userID)
                        };

                        $http({
                                method: 'POST',
                                url: 'php/getIdentity.php',
                                data: str,
                                header: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            })
                            .then(function (response) {
                                if (response.data === "failed") {
                                    //console.log("failed");
                                    identity = null;
                                    autheticated = false;
                                    deferred.resolve(identity);
                                } else {
                                    //console.log("yay");
                                    identity = response.data;
                                    autheticated = true;
                                    deferred.resolve(identity);
                                }
                            });
                        //else no cookie, and no identity, resolve null identity and return promise.
                    } else {
                        self.authenticate(identity);
                        deferred.resolve(identity);
                    }

                    return deferred.promise;
                }
            };
}])

/*Second factory, authorization, that calls principle.getIdentity() in it's authorize function
and also perform task after the function has resolved and returns it's promise*/
.factory('authorization', ['$rootScope', '$state', 'principle', '$location',
    function ($rootScope, $state, principle) {
            "use strict";
            return {
                authorize: function () {
                    return principle.getIdentity()
                        .then(function () {
                        
                            //get authenticated var from principle
                            var isAuthenticated = principle.isAuthenticated();
                            
                            //checks if you are authorized to go to the specific page
                            //gets $rootscope.to from main.js run function
                            //if it exists and roles is > 0 and the 
                            //route's assign role doesn't match any of the identity's role
                            if ($rootScope.to.data &&
                                $rootScope.to.data.roles.length > 0 &&
                                !principle.isInAnyRole($rootScope.to.data.roles)) {
                                
                                //if authenticated, go back home (prevents normal users) to go to admin settings
                                if (isAuthenticated) {
                                    $state.go('dashboard.home');
                                //else saved the current url state and params in $rootscope,
                                //and go back to login state for authentication first
                                //login.js should return back to the toState url
                                } else {

                                    $rootScope.returnToState = $rootScope.toState;
                                    $rootScope.returnToStateParams = $rootScope.toStateParams;

                                    $state.go('login');
                                }
                            }
                        
                            //if you came from the login state
                            //check if you are authenticad and go redirect to home
                            if ($rootScope.to.name === "login") {
                                if (isAuthenticated) {
                                    //console.log("hello");
                                    $state.go('dashboard.home');
                                }
                            }
                        });
                }
            };
    }
]);
