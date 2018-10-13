/*jslint white:true */
/*global angular */
/*global moment */
/*jslint plusplus:true*/
angular.module('mainApp').component('plantSelect', {
    templateUrl: 'template/plantSelect.html',
    bindings: {
        plantationsList: '<'
    },

    //Controller for login
    controller: function ($scope, notificationService, $sessionStorage, adminService) {
        "use strict";

        if (typeof (EventSource) !== "undefined") {
            // Yes! Server-sent events support!
            var source = new EventSource('/dashboard/plantations');

            source.onmessage = function (event) {
                $scope.eventmessage = JSON.parse(event.data);
                console.log($scope.eventmessage);
            };
        } else {
            console.log('SSE not supported by browser.');
        }

        this.$onInit = function () {
            $scope.plantations = this.plantationsList;

            var user = $sessionStorage.user;

            if (user.roleType === "Admin") {
                $scope.thisAdminUser = $sessionStorage.user;
                user = undefined;
            }

            $scope.checkAdmin = function () {
                if ($scope.thisAdminUser && $scope.thisAdminUser.roleType === "Admin") {
                    return true;
                }
                return false;
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
            //open the edit plant modal (reset form on show)
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
                $scope.editablePlant = angular.copy($scope.originalPlant);
            };

            $scope.resetEditPlantForm = function () {
                $scope.editPlantForm.$setUntouched();
                $scope.editPlantForm.$setPristine();
                $scope.adminPass = "";
                $scope.confirmPass = "";
                $scope.editablePlant = angular.copy($scope.originalPlant);
            };
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
                    promise = adminService.editPlantationDetails(edittedPlant, $scope.thisAdminUser, adminPass, originalPlant.plantationID, originalPlant.plantName, notfmsg);
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
                if (plant.minTemp >= plant.maxTemp || plant.minHum >= plant.maxHum || plant.minLI >= plant.maxLI || plant.minSM >= plant.maxSM) {
                    return false;
                }
                return true;
            };
            //concat the min and max values with '-' to be one string for saving on the database
            $scope.organizeOptimumRanges = function (plant) {
                plant.optimumLevels.airTemp = plant.minTemp + "-" + plant.maxTemp;
                plant.optimumLevels.humidity = plant.minHum + "-" + plant.maxHum;
                plant.optimumLevels.lightIntensity = plant.minLI + "-" + plant.maxLI;
                plant.optimumLevels.soilMoisture = plant.minSM + "-" + plant.maxSM;

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

            $scope.generateEditNotfMsg = function (edittedPlant, originalPlant) {
                var msg = "editted plantation details for " + originalPlant.plantName + " (" + originalPlant.plantationID + ") <ol>";
                if (edittedPlant.plantationID !== originalPlant.plantationID) {
                    msg = msg + "<li>Changed ID: " + originalPlant.plantationID + " to " + edittedPlant.plantationID + "</li>";
                }

                if (edittedPlant.plantName !== originalPlant.plantName) {
                    msg = msg + "<li>Changed plantation name: " + originalPlant.plantName + " to " + edittedPlant.plantName + "</li>";
                }

                if (edittedPlant.nodeNumber !== originalPlant.nodeNumber) {
                    msg = msg + "<li>Changed node ID: " + originalPlant.nodeNumber + " to " + edittedPlant.nodeNumber + "</li>";
                }

                if (edittedPlant.plantDescription !== originalPlant.plantDescription) {
                    msg = msg + "<li>Changed description: " + originalPlant.plantDescription + " to " + edittedPlant.plantDescription + "</li>";
                }

                if (edittedPlant.numOfPlants !== originalPlant.numOfPlants) {
                    msg = msg + "<li>Changed the number of plants: " + originalPlant.numOfPlants + " to " + edittedPlant.numOfPlants + "</li>";
                }

                if (!angular.equals(originalPlant, edittedPlant)) {

                    msg = msg + "<li>Changed optimum ranges:<ul>";

                    if (edittedPlant.optimumLevels.airTemp !== originalPlant.optimumLevels.airTemp) {
                        msg = msg + "<li>Temperature (C): " + originalPlant.optimumLevels.airTemp + " to " + edittedPlant.optimumLevels.airTemp + "</li>";
                    }


                    if (edittedPlant.optimumLevels.humidity !== originalPlant.optimumLevels.humidity) {
                        msg = msg + "<li>Humidity (%): " + originalPlant.optimumLevels.airTemp + " to " + edittedPlant.optimumLevels.airTemp + "</li>";
                    }

                    if (edittedPlant.optimumLevels.lightIntensity !== originalPlant.optimumLevels.lightIntensity) {
                        msg = msg + "<li>Light Intensity (Lux): " + originalPlant.optimumLevels.lightIntensity + " to " + edittedPlant.optimumLevels.lightIntensity + "</li>";
                    }

                    if (edittedPlant.optimumLevels.soilMoisture !== originalPlant.optimumLevels.soilMoisture) {
                        msg = msg + "<li>Soil Moisture (%): " + originalPlant.optimumLevels.soilMoisture + " to " + edittedPlant.optimumLevels.soilMoisture + "</li>";
                    }

                    msg = msg + "</ul></li>";
                }

                msg = msg + "</ol>";
                return msg;
            };
        };
    }

});
