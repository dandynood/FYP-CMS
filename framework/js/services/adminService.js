/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').service('adminService', function ($http, $q) {
    "use strict";
    var service = {
        getAllUsers: function () {
            var deferred = $q.defer();

            $http({
                    method: 'POST',
                    url: 'php/getUsers.php',
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        var errMsg = "failed";
                        deferred.resolve(errMsg);
                    } else {
                        deferred.resolve(response.data);
                    }
                });


            return deferred.promise;
        },

        editUser: function (userId, details) {
            var deferred = $q.defer(),
                msg,
                str = {
                    userID: encodeURIComponent(userId),
                    username: encodeURIComponent(details.username),
                    firstName: encodeURIComponent(details.firstName),
                    lastName: encodeURIComponent(details.lastName),
                    email: encodeURIComponent(details.email),
                    phoneNumber: encodeURIComponent(details.phoneNumber),
                    roleType: encodeURIComponent(details.roleType)
                };

            $http({
                    method: 'POST',
                    url: 'php/editUser.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        msg = "failed";
                        deferred.resolve(msg);
                    } else {
                        msg = "success";
                        deferred.resolve(msg);
                    }
                });

            return deferred.promise;
        },

        editUserPassword: function (userId, password) {
            var deferred = $q.defer(),
                msg,
                str = {
                    userID: encodeURIComponent(userId),
                    password: encodeURIComponent(password)
                };

            $http({
                    method: 'POST',
                    url: 'php/editUserPassword.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        msg = "failed";
                        deferred.resolve(msg);
                    } else {
                        msg = "success";
                        deferred.resolve(msg);
                    }
                });

            return deferred.promise;
        },

        editPlantation: function (plantationID, details) {
            var deferred = $q.defer(),
                msg,
                str = {
                    plantID: encodeURIComponent(plantationID),
                    plantName: encodeURIComponent(details.plantName),
                    plantDescription: encodeURIComponent(details.plantDescription)
                };

            $http({
                    method: 'POST',
                    url: 'php/editPlantation.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        msg = "failed";
                        deferred.resolve(msg);
                    } else {
                        msg = "success";
                        deferred.resolve(msg);
                    }
                });

            return deferred.promise;
        },

        registerUser: function (newUser) {
            var deferred = $q.defer(),
                msg,
                str = {
                    username: encodeURIComponent(newUser.username),
                    password: encodeURIComponent(newUser.password),
                    firstName: encodeURIComponent(newUser.firstName),
                    lastName: encodeURIComponent(newUser.lastName),
                    email: encodeURIComponent(newUser.email),
                    phoneNumber: encodeURIComponent(newUser.phoneNumber),
                    roleType: encodeURIComponent(newUser.roleType)
                };

            $http({
                    method: 'POST',
                    url: 'php/registerUser.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        msg = "failed";
                        deferred.resolve(msg);
                    } else {
                        msg = "success";
                        deferred.resolve(msg);
                    }
                });

            return deferred.promise;
        },

        addNewPlantation: function (newPlantation) {
            var deferred = $q.defer(),
                msg,
                str = {
                    plantID: encodeURIComponent(newPlantation.plantationID),
                    plantName: encodeURIComponent(newPlantation.plantName),
                    plantDescription: encodeURIComponent(newPlantation.plantDescription)
                };

            $http({
                    method: 'POST',
                    url: 'php/addPlantation.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        msg = "failed";
                        deferred.resolve(msg);
                    } else {
                        msg = "success";
                        deferred.resolve(msg);
                    }
                });

            return deferred.promise;
        }

    };

    return service;

});
