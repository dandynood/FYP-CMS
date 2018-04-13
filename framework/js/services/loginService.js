/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').factory('principle', ['$q', '$http', '$cookies', '$state',
    function ($q, $http, $cookies, $state) {
            "use strict";
            var identity,
                autheticated = false;

            return {
                isIdentityResolved: function () {
                    return angular.isDefined(identity);
                },

                isAuthenticated: function () {
                    return autheticated;
                },

                isInRole: function (role) {
                    if (!autheticated || !identity.roleType) {
                        return false;
                    }

                    return identity.roleType === role;
                },

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

                authenticate: function (iden) {
                    identity = iden;
                    autheticated = iden !== undefined && iden !== null;

                    if (iden) {
                        $cookies.putObject("user", iden);
                    } else {
                        $cookies.remove("user");
                    }
                },

                getAuthentication: function () {
                    $state.go('login');
                },

                getIdentity: function (force) {
                    console.log("hello");
                    console.log($cookies.getObject("user"));
                    var deferred = $q.defer(),
                        self = this,
                        str;

                    if (force === true) {
                        identity = undefined;
                    }

                    if (angular.isDefined(identity)) {
                        deferred.resolve(identity);

                        return deferred.promise;
                    }

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
                                    console.log("failed");
                                    identity = null;
                                    autheticated = false;
                                    deferred.resolve(identity);
                                } else {
                                    console.log("yay");
                                    identity = response.data;
                                    autheticated = true;
                                    deferred.resolve(identity);
                                }
                            });
                    } else {
                        self.authenticate(identity);
                        deferred.resolve(identity);
                    }

                    return deferred.promise;
                }
            };
}])

    .factory('authorization', ['$rootScope', '$state', 'principle', '$location',
    function ($rootScope, $state, principle, $location) {
            "use strict";
            return {
                authorize: function () {
                    return principle.getIdentity()
                        .then(function () {
                            var isAuthenticated = principle.isAuthenticated();
                            console.log($rootScope.to);

                            if ($rootScope.to.data &&
                                $rootScope.to.data.roles.length > 0 &&
                                !principle.isInAnyRole($rootScope.to.data.roles)) {
                                if (isAuthenticated) {
                                    console.log("hello");
                                    $state.go('dashboard.home');
                                } else {

                                    $rootScope.returnToState = $rootScope.toState;
                                    $rootScope.returnToStateParams = $rootScope.toStateParams;

                                     $state.go('login');
                                }
                            }

                            if ($rootScope.to.name === "login") {
                                if (isAuthenticated) {
                                    console.log("hello");
                                    $state.go('dashboard.home');
                                }
                            }
                        });
                }
            };
    }
]);
