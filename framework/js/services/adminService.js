/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').factory('adminService', function ($http, $q) {
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

        editUserDetails: function (details, adminID, adminPass) {
            var msg,
                str = {
                    userID: encodeURIComponent(details.userID),
                    username: encodeURIComponent(details.username),
                    firstName: encodeURIComponent(details.firstName),
                    lastName: encodeURIComponent(details.lastName),
                    email: encodeURIComponent(details.email),
                    phoneNumber: encodeURIComponent(details.phoneNumber),
                    roleType: encodeURIComponent(details.roleType),
                    adminID: encodeURIComponent(adminID),
                    adminPass: encodeURIComponent(adminPass)
                };

            return $http({
                    method: 'POST',
                    url: 'php/editUser.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    //console.log(response.data);
                    if (response.data === "failed") {
                        msg = "failed";
                    } else if (response.data === "success") {
                        msg = "success";
                    } else if (response.data === "unauthorized") {
                        msg = "unauthorized";
                    } else if (response.data === "non-unique") {
                        msg = "non-unique";
                    }
                    return msg;
                });

        },

        //Change the user password
        changeUserPassword: function (userId, adminID, adminPass, newPass) {
            var msg,
                str = {
                    userID: encodeURIComponent(userId),
                    adminID: encodeURIComponent(adminID),
                    adminPass: encodeURIComponent(adminPass),
                    newPass: encodeURIComponent(newPass)
                };

            return $http({
                    method: 'POST',
                    url: 'php/changeUserPassword.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    //console.log(response.data);
                    if (response.data === "failed") {
                        msg = "failed";
                    } else if (response.data === "success") {
                        msg = "success";
                    } else if (response.data === "unauthorized") {
                        msg = "unauthorized";
                    }
                    return msg;
                });
        },

        editPlantationDetails: function (details, admin, adminPass, originalPlantID, originalPlantName, notfmsg) {
            var msg,
                str = {
                    plantID: encodeURIComponent(details.plantationID),
                    originalPlantID: encodeURIComponent(originalPlantID),
                    nodeID: encodeURIComponent(details.nodeNumber),
                    plantName: encodeURIComponent(details.plantName),
                    originalPlantName: encodeURIComponent(originalPlantName),
                    plantDescription: encodeURIComponent(details.plantDescription),
                    numOfPlants: encodeURIComponent(details.numOfPlants),
                    airTemp: encodeURIComponent(details.optimumLevels.airTemp),
                    humidity: encodeURIComponent(details.optimumLevels.humidity),
                    lightIntensity: encodeURIComponent(details.optimumLevels.lightIntensity),
                    soilMoisture: encodeURIComponent(details.optimumLevels.soilMoisture),
                    adminPass: encodeURIComponent(adminPass),
                    adminID: encodeURIComponent(admin.userID),
                    adminUserName: encodeURIComponent(admin.username),
                    notfmsg: encodeURIComponent(notfmsg)
                };

            return $http({
                    method: 'POST',
                    url: 'php/editPlantation.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    //console.log(response.data);
                    if (response.data === "failed") {
                        msg = "failed";
                    } else if (response.data === "success") {
                        msg = "success";
                    } else if (response.data === "unauthorized") {
                        msg = "unauthorized";
                    } else if (response.data === "non-unique") {
                        msg = "non-unique";
                    }
                    return msg;
                });
        },

        registerUser: function (newUser, adminID) {
            var msg,
                str = {
                    username: encodeURIComponent(newUser.username),
                    password: encodeURIComponent(newUser.password),
                    firstName: encodeURIComponent(newUser.firstName),
                    lastName: encodeURIComponent(newUser.lastName),
                    email: encodeURIComponent(newUser.email),
                    phoneNumber: encodeURIComponent(newUser.phoneNumber),
                    roleType: encodeURIComponent(newUser.roleType),
                    adminPass: encodeURIComponent(newUser.adminPass),
                    adminID: encodeURIComponent(adminID)
                };

            return $http({
                    method: 'POST',
                    url: 'php/registerUser.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    //console.log(response.data);
                    if (response.data === "failed") {
                        msg = "failed";
                    } else if (response.data === "success") {
                        msg = "success";
                    } else if (response.data === "unauthorized") {
                        msg = "unauthorized";
                    } else if (response.data === "non-unique") {
                        msg = "non-unique";
                    }
                    return msg;
                });

        },

        //test this
        addNewPlantation: function (newPlantation, admin) {
            var msg,
                str = {
                    plantID: encodeURIComponent(newPlantation.plantationID),
                    nodeID: encodeURIComponent(newPlantation.nodeID),
                    plantName: encodeURIComponent(newPlantation.plantName),
                    plantDescription: encodeURIComponent(newPlantation.plantDescription),
                    numOfPlants: encodeURIComponent(newPlantation.numOfPlants),
                    airTemp: encodeURIComponent(newPlantation.airTemp),
                    humidity: encodeURIComponent(newPlantation.humidity),
                    lightIntensity: encodeURIComponent(newPlantation.lightIntensity),
                    soilMoisture: encodeURIComponent(newPlantation.soilMoisture),
                    adminPass: encodeURIComponent(newPlantation.adminPass),
                    adminID: encodeURIComponent(admin.userID),
                    adminUserName: encodeURIComponent(admin.username)
                };
            
            //console.log(str);
            
            return $http({
                    method: 'POST',
                    url: 'php/addPlantation.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    console.log(response.data);
                    if (response.data === "failed") {
                        msg = "failed";
                    } else if (response.data === "success") {
                        msg = "success";
                    } else if (response.data === "unauthorized") {
                        msg = "unauthorized";
                    } else if (response.data === "non-unique") {
                        msg = "non-unique";
                    }
                    return msg;
                });
        },

        deleteUser: function (userId, adminID, adminPassword) {
            var msg,
                str = {
                    userID: encodeURIComponent(userId),
                    adminID: encodeURIComponent(adminID),
                    adminPass: encodeURIComponent(adminPassword)
                };

            return $http({
                    method: 'POST',
                    url: 'php/deleteUser.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    //console.log(response.data);
                    if (response.data === "failed") {
                        msg = "failed";
                    } else if (response.data === "success") {
                        msg = "success";
                    } else if (response.data === "unauthorized") {
                        msg = "unauthorized";
                    }
                    return msg;
                });

        },

        //test this
        deletePlantation: function (plantID, plantName, admin, adminPass) {
            var msg,
                str = {
                    plantID: encodeURIComponent(plantID),
                    plantName: encodeURIComponent(plantName),
                    adminPass: encodeURIComponent(adminPass),
                    adminID: encodeURIComponent(admin.userID),
                    adminUserName: encodeURIComponent(admin.username)
                };

            return $http({
                    method: 'POST',
                    url: 'php/deletePlantation.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    console.log(response.data);
                    if (response.data === "failed") {
                        msg = "failed";
                    } else if (response.data === "success") {
                        msg = "success";
                    } else if (response.data === "unauthorized") {
                        msg = "unauthorized";
                    }
                    return msg;
                });
        }

    };

    return service;

});
