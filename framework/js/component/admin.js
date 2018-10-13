/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('admin', {
    templateUrl: 'template/admin.html',
    bindings: {
        users: '<',
        adminPlantations: '<',
        plantationsFromParent: '<',
        conditionsFromParent: '<'
    },

    //Controller for login
    controller: function ($scope, $sessionStorage, principle, adminService, plantationService, optimumLevelsService) {
        "use strict";
        var self = this;

        self.$onInit = function () {
            $scope.users = self.users;
            $scope.plantations = self.adminPlantations;
            $scope.plantationsFromParent = self.plantationsFromParent;
            $scope.conditionsFromParent = self.conditionsFromParent;
            //console.log($scope.plantations);

            $scope.thisAdminUser = $sessionStorage.user;
            console.log($scope.thisAdminUser);

            //get user details when viewing the user modal (view and edit) via user name
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

            //Gets the plantation details when viewing the plantation modal (view and edit) via plantation id
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

            //open add user modal (reset form on show)
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

            //open add plantation modal (reset form on show)
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

            //open the delete user modal (reset form on show)
            $scope.openDeleteUserModel = function (id) {
                $scope.adminPass = "";
                $scope.confirmPass = "";
                $scope.displayErrors = false;
                $scope.displaySuccess = false;
                $scope.errorMsg = null;
                $scope.successMsg = null;

                $scope.getUserDetails(id);
            };

            //open the delete plant modal (reset form on show)
            $scope.openDeletePlantModel = function (id) {
                $scope.adminPass = "";
                $scope.confirmPass = "";
                $scope.displayErrors = false;
                $scope.displaySuccess = false;
                $scope.errorMsg = null;
                $scope.successMsg = null;

                $scope.getPlantationDetails(id);
            };

            //open the change password modal (reset form on show)
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
                //console.log($scope.originalPlant);
                $scope.editablePlant = angular.copy($scope.originalPlant);
            };

            $scope.resetEditPlantForm = function () {
                $scope.editPlantForm.$setUntouched();
                $scope.editPlantForm.$setPristine();
                $scope.adminPass = "";
                $scope.confirmPass = "";
                $scope.editablePlant = angular.copy($scope.originalPlant);
            };

            //all form actions functions below, add, edit, delete first checks if the admin password is confirmed, and then it makes a promise, calling the adminService functions and sending the inputs from the form and gets a return response (if saving was successful, server problem in saving, password is wrong/unauthorized, or non-unique username) with a message showing on the form at the end

            //Add user function (user object has the form details)
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
                            $scope.refreshUsers();
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
                        } else if (msg === "non-unique") {
                            $scope.errorMsg = {
                                status: "Username has been taken!",
                                msg: "It appears you entered a non-unique username. Someone already has this username!"
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };

            //Add plantation function
            //test this
            $scope.addPlantation = function (plantation) {
                var promise;
                console.log("hello", plantation);
                if (plantation.adminPass !== plantation.confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    plantation = $scope.organizeOptimumRanges(plantation);
                    promise = adminService.addNewPlantation(plantation, $scope.thisAdminUser);

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
                            $scope.refreshPlantations();
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
                        } else if (msg === "non-unique") {
                            $scope.errorMsg = {
                                status: "ID has been taken!",
                                msg: "It appears you entered a non-unique plantation ID. It already exists on the database!"
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
                            $scope.refreshUsers();
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
            //test this
            $scope.deletePlant = function (plant, adminPass, confirmPass) {
                var promise;
                if (adminPass !== confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    promise = adminService.deletePlantation(plant.plantationID, plant.plantName, $scope.thisAdminUser, adminPass);
                    promise.then(function (msg) {
                        if (msg === "success") {
                            $scope.successMsg = {
                                status: "Success!",
                                msg: "This plantation has been removed from the system: "
                            };
                            $scope.displaySuccess = true;
                            $scope.refreshPlantations();
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

            //change the user password
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

            //used to disable the save function in the edit form if nothing has changed between the original info
            $scope.editUserFormCheckIfEqual = function () {
                return angular.equals($scope.editableDetails, $scope.originalUser);
            };

            //edit user details
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
                            if ($scope.thisAdminUser.userID === edittedUser.userID) {
                                //console.log(edittedUser.userID);
                                $sessionStorage.user = angular.copy(edittedUser);
                                promise = principle.getIdentity(true);
                                promise.then(function (data) {
                                    $scope.thisAdminUser = angular.copy(data);
                                });
                            }
                            $scope.refreshUsers();
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
                        } else if (msg === "non-unique") {
                            $scope.errorMsg = {
                                status: "Username has been taken!",
                                msg: "It appears you entered a non-unique username. Someone already has this username!"
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };

            //same as editUserFormCheckIfEqual
            $scope.editPlantFormCheckIfEqual = function () {
                return angular.equals($scope.editablePlant, $scope.originalPlant);
            };

            //edit plant details
            $scope.editPlantDetails = function (edittedPlant, adminPass, confirmPass, originalPlant) {
                var promise, notfmsg;
                if (adminPass !== confirmPass) {
                    $scope.displayErrors = true;
                    $scope.errorMsg = {
                        status: "Error!",
                        msg: "It appears that the password or confirm password isn't the same"
                    };
                } else {
                    edittedPlant = $scope.organizeOptimumRanges(edittedPlant);
                    notfmsg = $scope.generateEditNotfMsg(edittedPlant, originalPlant);
                    promise = adminService.editPlantationDetails(edittedPlant, $scope.thisAdminUser, adminPass, originalPlant.plantationID, originalPlant.plantName);
                    promise.then(function (msg) {
                        if (msg === "success") {
                            $scope.successMsg = {
                                status: "Success!",
                                msg: "The user's details has been successfully editted"
                            };
                            $scope.displaySuccess = true;
                            $scope.refreshPlantations();
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
                        } else if (msg === "non-unique") {
                            $scope.errorMsg = {
                                status: "ID has been taken!",
                                msg: "It appears you entered a non-unique plantation ID. It already exists on the database!"
                            };
                            $scope.displayErrors = true;
                        }
                    });
                }
            };

            //use to validate the min and max values (min must not be more than max and etc) or else show errors and disable save button
            $scope.validateOptimumRange = function (plant) {
                console.log("hello");
                if (plant.minTemp >= plant.maxTemp || plant.minHum >= plant.maxHum || plant.minLI >= plant.maxLI || plant.minSM >= plant.maxSM) {
                    return false;
                }
                return true;
            };

            //concat the min and max values with '-' to be one string for saving on the database
            $scope.organizeOptimumRanges = function (plant) {
                plant.airTemp = plant.minTemp + "-" + plant.maxTemp;
                plant.humidity = plant.minHum + "-" + plant.maxHum;
                plant.lightIntensity = plant.minLI + "-" + plant.maxLI;
                plant.soilMoisture = plant.minSM + "-" + plant.maxSM;

                return plant;
            };

            //the opposite of above for showing and editing on the forms for each plantation
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

            //quick and dirty way to update the plant and users after admin changes (NEED TO BE REPLACED WITH SSE OR WEBSOCKETS)
            $scope.refreshPlantations = function () {
                var promise = plantationService.getAllplantations(),
                    promise2, promise3, i;
                promise.then(function (data) {
                    $scope.plantationsFromParent.length = 0;
                    for (i = 0; i < data.length; i++) {
                        $scope.plantationsFromParent.push(data[i]);
                    }

                    promise2 = plantationService.getAllLevels(data, '2018-04-07');

                    promise2.then(function (data) {
                        $scope.conditionsFromParent.length = 0;
                        for (i = 0; i < data.length; i++) {
                            $scope.conditionsFromParent[i] = data[i];
                        }
                    });

                    promise3 = optimumLevelsService.getAllOptimumLevels(data);
                    promise3.then(function (data) {
                        $scope.plantations.length = 0;
                        for (i = 0; i < data.length; i++) {
                            $scope.plantations[i] = data[i];
                        }
                        self.adminPlantations = angular.copy($scope.plantations);
                    });

                });
            };

            $scope.refreshUsers = function () {
                var promise = adminService.getAllUsers();
                promise.then(function (data) {
                    self.users = angular.copy(data);
                    $scope.users = self.users;
                });
            };

            $scope.generateEditNotfMsg = function (edittedPlant, originalPlant) {
                var msg = "editted a plantation, ";
                if(edittedPlant.plantationID !== originalPlant.plantationID){
                    
                }
                
                if(edittedPlant.plantName !== originalPlant.plantName){
                    
                }
                
                if(edittedPlant.nodeID !== originalPlant.nodeID){
                    
                }
            };
        };
    }

});
