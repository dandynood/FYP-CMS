/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('admin', {
    templateUrl: 'template/admin.html',
    bindings: {
        users: '<',
        plantations: '<'
    },

    //Controller for login
    controller: function ($scope, $sessionStorage, adminService) {
        "use strict";
        var self = this;

        self.$onInit = function () {
            $scope.users = self.users;
            $scope.plantations = self.plantations;
            console.log($scope.plantations);

            $scope.thisAdminUser = $sessionStorage.user;

            $scope.getUserDetails = function (username) {
                $scope.individualUser = {};
                var i;
                for (i = 0; i < $scope.users.length; i++) {
                    if ($scope.users[i].username === username) {
                        $scope.individualUser = $scope.users[i];
                        break;
                    }
                }
            };

            $scope.getPlantationDetails = function (id) {
                $scope.individualPlantation = {};
                var i;
                for (i = 0; i < $scope.plantations.length; i++) {
                    if ($scope.plantations[i].plantationID === id) {
                        $scope.individualPlantation = $scope.plantations[i];
                        break;
                    }
                }
            };

            $scope.openAddUserModal = function () {
                $scope.newUser = {};
                $scope.addUserForm.$setUntouched();
                $scope.addUserForm.$setPristine();
                $scope.displayErrors = false;
                $scope.displaySuccess = false;
                $scope.errorMsg = null;
                $scope.successMsg = null;

                $scope.newUser = {
                    username: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    roleType: "Normal",
                    adminPass: "",
                    confirmPass: ""
                };
            };

            $scope.openAddPlantationModal = function () {
                $scope.newPlant = {};
                $scope.addPlantForm.$setUntouched();
                $scope.addPlantForm.$setPristine();
                $scope.displayErrors = false;
                $scope.displaySuccess = false;
                $scope.errorMsg = null;
                $scope.successMsg = null;

                $scope.newPlant = {
                    plantationID: "",
                    nodeID: "",
                    plantName: "",
                    plantDescription: "",
                    numOfPlants: "",
                    minTemp: 0,
                    maxTemp: 50,
                    minHum: 50,
                    maxHum: 100,
                    minLI: 25000,
                    maxLI: 55000,
                    minSM: 50,
                    maxSM: 100,
                    adminPass: "",
                    confirmPass: ""
                };
            };

            $scope.openDeleteUserModel = function (id) {
                $scope.adminPass = "";
                $scope.confirmPass = "";

                $scope.getUserDetails(id);
            };

            $scope.openDeletePlantModel = function (id) {
                $scope.adminPass = "";
                $scope.confirmPass = "";

                $scope.getPlantationDetails(id);
            };

            $scope.openChangePasswordModal = function (id) {
                $scope.changePasswordForm.$setUntouched();
                $scope.changePasswordForm.$setPristine();
                $scope.adminPass = "";
                $scope.confirmPass = "";
                $scope.newUserPassword = "";
                $scope.newUserConfirmPassword = "";
                $scope.displayErrors = false;
                $scope.displaySuccess = false;
                $scope.errorMsg = null;
                $scope.successMsg = null;

                $scope.getUserDetails(id);
            };

            $scope.openEditUserModal = function (username) {
                $scope.editUserForm.$setUntouched();
                $scope.editUserForm.$setPristine();
                $scope.displayErrors = false;
                $scope.displaySuccess = false;
                $scope.errorMsg = null;
                $scope.successMsg = null;
                $scope.adminPass = "";
                $scope.confirmPass = "";

                $scope.getUserDetails(username);
                $scope.originalUser = $scope.individualUser;
                $scope.editableDetails = angular.copy($scope.originalUser);
            };

            $scope.resetEditUserForm = function () {
                $scope.editUserForm.$setUntouched();
                $scope.editUserForm.$setPristine();
                $scope.adminPass = "";
                $scope.confirmPass = "";
                $scope.editableDetails = angular.copy($scope.originalUser);
            };

            $scope.openPlantEditModal = function (id) {
                $scope.editPlantForm.$setUntouched();
                $scope.editPlantForm.$setPristine();
                $scope.displayErrors = false;
                $scope.displaySuccess = false;
                $scope.errorMsg = null;
                $scope.successMsg = null;
                $scope.adminPass = "";
                $scope.confirmPass = "";

                $scope.getPlantationDetails(id);
                $scope.originalPlant = $scope.individualPlantation;
                $scope.originalPlant = $scope.splitOptimumRanges($scope.originalPlant);
                console.log($scope.originalPlant);
                $scope.editablePlant = angular.copy($scope.originalPlant);
            };

            $scope.resetEditPlantForm = function () {
                $scope.editPlantForm.$setUntouched();
                $scope.editPlantForm.$setPristine();
                $scope.adminPass = "";
                $scope.confirmPass = "";
                $scope.editablePlant = angular.copy($scope.originalPlant);
            };

            //Add user function
            $scope.addUser = function (user) {
                var promise;
                if (user.adminPass !== user.confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    promise = adminService.registerUser(user, $scope.thisAdminUser.userID);

                    promise.then(function (msg) {
                        if (msg === "success") {
                            $scope.resultNewUser = {
                                username: user.username,
                                password: "******",
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                phoneNumber: user.phoneNumber,
                                roleType: user.roleType
                            };
                            $scope.successMsg = {
                                status: "Success!",
                                msg: "The user has finally been registered with these details:"
                            };
                            $scope.displaySuccess = true;
                            $scope.newUser = {};
                        } else if (msg === "failed") {
                            $scope.errorMsg = {
                                status: "Something went wrong.",
                                msg: "It appears there was a fatal error in registering the user either on the web application, server, or database."
                            };
                            $scope.displayErrors = true;
                        } else if (msg === "unauthorized") {
                            $scope.errorMsg = {
                                status: "Unauthorized!",
                                msg: "It appears you failed enter your correct password to authorize yourself."
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };

            //Add plantation function
            $scope.addPlantation = function (plantation) {
                var promise;
                if (plantation.adminPass !== plantation.confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    plantation = $scope.organizeOptimumRanges(plantation);
                    console.log(plantation);
                    promise = adminService.addNewPlantation(plantation, $scope.thisAdminUser.userID);

                    promise.then(function (msg) {
                        if (msg === "success") {
                            $scope.resultNewPlant = {
                                plantationID: plantation.plantationID,
                                nodeID: plantation.nodeID,
                                plantName: plantation.plantName,
                                plantDescription: plantation.plantDescription,
                                numOfPlants: plantation.numOfPlants,
                                airTemp: plantation.airTemp,
                                humidity: plantation.humidity,
                                lightIntensity: plantation.lightIntensity,
                                soilMoisture: plantation.soilMoisture
                            };
                            $scope.successMsg = {
                                status: "Success!",
                                msg: "The plantation has finally been added with these details:"
                            };
                            $scope.displaySuccess = true;
                            $scope.newPlant = {};
                        } else if (msg === "failed") {
                            $scope.errorMsg = {
                                status: "Something went wrong.",
                                msg: "It appears there was a fatal error in adding the plantation either on the web application, server, or database."
                            };
                            $scope.displayErrors = true;
                        } else if (msg === "unauthorized") {
                            $scope.errorMsg = {
                                status: "Unauthorized!",
                                msg: "It appears you failed enter your correct password to authorize yourself."
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };

            //Delete the user (BUT DON'T BE ABUSIVE)
            $scope.deleteUser = function (id, adminPass, confirmPass) {
                var promise;
                if (adminPass !== confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    promise = adminService.deleteUser(id, $scope.thisAdminUser.userID, adminPass);

                    promise.then(function (msg) {
                        if (msg === "success") {
                            $scope.successMsg = {
                                status: "Success!",
                                msg: "This user has been removed from the system:"
                            };
                            $scope.displaySuccess = true;
                        } else if (msg === "failed") {
                            $scope.errorMsg = {
                                status: "Something went wrong.",
                                msg: "It appears there was a fatal error in adding the plantation either on the web application, server, or database."
                            };
                            $scope.displayErrors = true;
                        } else if (msg === "unauthorized") {
                            $scope.errorMsg = {
                                status: "Unauthorized!",
                                msg: "It appears you failed enter your correct password to authorize yourself."
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };

            //Delete your plants 
            $scope.deletePlant = function (id, adminPass, confirmPass) {
                var promise;
                if (adminPass !== confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    promise = adminService.deletePlantation(id, $scope.thisAdminUser.userID, adminPass);
                    promise.then(function (msg) {
                        if (msg === "success") {
                            $scope.successMsg = {
                                status: "Success!",
                                msg: "This plantation has been removed from the system: "
                            };
                            $scope.displaySuccess = true;
                        } else if (msg === "failed") {
                            $scope.errorMsg = {
                                status: "Something went wrong.",
                                msg: "It appears there was a fatal error in adding the plantation either on the web application, server, or database."
                            };
                            $scope.displayErrors = true;
                        } else if (msg === "unauthorized") {
                            $scope.errorMsg = {
                                status: "Unauthorized!",
                                msg: "It appears you failed enter your correct password to authorize yourself."
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };

            $scope.changeUserPassword = function (id, newPass, adminPass, confirmPass) {
                var promise;
                if (adminPass !== confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    promise = adminService.changeUserPassword(id, $scope.thisAdminUser.userID, adminPass, newPass);
                    promise.then(function (msg) {
                        if (msg === "success") {
                            $scope.successMsg = {
                                status: "Success!",
                                msg: "The user's password has been successfully changed"
                            };
                            $scope.displaySuccess = true;
                        } else if (msg === "failed") {
                            $scope.errorMsg = {
                                status: "Something went wrong.",
                                msg: "It appears there was a fatal error in changing the user's password either on the web application, server, or database."
                            };
                            $scope.displayErrors = true;
                        } else if (msg === "unauthorized") {
                            $scope.errorMsg = {
                                status: "Unauthorized!",
                                msg: "It appears you failed enter your correct password to authorize yourself."
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };

            $scope.editUserFormCheckIfEqual = function () {
                return angular.equals($scope.editableDetails, $scope.originalUser);
            };

            $scope.editUserDetails = function (edittedUser, adminPass, confirmPass) {
                var promise;
                if (adminPass !== confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    promise = adminService.editUserDetails(edittedUser, $scope.thisAdminUser.userID, adminPass);
                    promise.then(function (msg) {
                        if (msg === "success") {
                            $scope.successMsg = {
                                status: "Success!",
                                msg: "The user's details has been successfully editted"
                            };
                            $scope.displaySuccess = true;
                        } else if (msg === "failed") {
                            $scope.errorMsg = {
                                status: "Something went wrong.",
                                msg: "It appears there was a fatal error in changing the user's password either on the web application, server, or database."
                            };
                            $scope.displayErrors = true;
                        } else if (msg === "unauthorized") {
                            $scope.errorMsg = {
                                status: "Unauthorized!",
                                msg: "It appears you failed enter your correct password to authorize yourself."
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };

            $scope.editPlantFormCheckIfEqual = function () {
                return angular.equals($scope.editablePlant, $scope.originalPlant);
            };

            $scope.editPlantDetails = function (edittedPlant, adminPass, confirmPass, originalPlantID) {
                var promise;
                if (adminPass !== confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    edittedPlant = $scope.organizeOptimumRanges(edittedPlant);
                    promise = adminService.editPlantationDetails(edittedPlant, $scope.thisAdminUser.userID, adminPass, originalPlantID);
                    promise.then(function (msg) {
                        if (msg === "success") {
                            $scope.successMsg = {
                                status: "Success!",
                                msg: "The user's details has been successfully editted"
                            };
                            $scope.displaySuccess = true;
                        } else if (msg === "failed") {
                            $scope.errorMsg = {
                                status: "Something went wrong.",
                                msg: "It appears there was a fatal error in changing the user's password either on the web application, server, or database."
                            };
                            $scope.displayErrors = true;
                        } else if (msg === "unauthorized") {
                            $scope.errorMsg = {
                                status: "Unauthorized!",
                                msg: "It appears you failed enter your correct password to authorize yourself."
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };


            $scope.validateOptimumRange = function (plant) {
                if (plant.minTemp >= plant.maxTemp || plant.minHum >= plant.maxHum || plant.minLI >= plant.maxLI || plant.minSM >= plant.maxSM) {
                    return false;
                }
                return true;
            };

            $scope.organizeOptimumRanges = function (plant) {
                plant.airTemp = plant.minTemp + "-" + plant.maxTemp;
                plant.humidity = plant.minHum + "-" + plant.maxHum;
                plant.lightIntensity = plant.minLI + "-" + plant.maxLI;
                plant.soilMoisture = plant.minSM + "-" + plant.maxSM;

                return plant;
            };

            $scope.splitOptimumRanges = function (plant) {
                var temp = plant.optimumLevels.airTemp.split("-"),
                    humidity = plant.optimumLevels.humidity.split("-"),
                    LI = plant.optimumLevels.lightIntensity.split("-"),
                    SM = plant.optimumLevels.soilMoisture.split("-");
                plant.minTemp = +temp[0];
                plant.maxTemp = +temp[1];
                plant.minHum = +humidity[0];
                plant.maxHum = +humidity[1];
                plant.minLI = +LI[0];
                plant.maxLI = +LI[1];
                plant.minSM = +SM[0];
                plant.maxSM = +SM[1];

                return plant;
            };

        };
    }

});
