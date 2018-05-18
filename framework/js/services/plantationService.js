/*jslint white:true */
/*global angular */
/*global moment */
/*jslint plusplus:true*/
angular.module('mainApp').factory('plantationService', function ($http, $q) {
    "use strict";
    var plantations,
        allLevels,
        service;

    service = {
        //When dashboard parent state loads
        getAllplantations: function () {
            var deferred = $q.defer();

            if (angular.isDefined(plantations)) {
                deferred.resolve(plantations);
            } else {

                $http({
                        method: 'POST',
                        url: 'php/getPlantations.php',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(function (response) {
                        if (response.data === "failed") {
                            var errMsg = "failed";
                            deferred.resolve(errMsg);
                        } else {
                            plantations = angular.copy(response.data);
                            deferred.resolve(response.data);
                        }
                    });
            }

            return deferred.promise;
        },

        //is called when you go to a dashboard.plantation state
        getPlantation: function (id) {
            var deferred = $q.defer(),
                copy,
                i,
                str = {
                    plantationID: encodeURIComponent(id)
                };

            //This should work given how getAllLevels got all plantation conditions from loading
            //the dashboard parent state
            if (angular.isDefined(allLevels)) {
                for (i = 0; i < allLevels.length; i++) {
                    if (allLevels[i].plantationID === id) {
                        copy = angular.copy(allLevels[i]);
                        deferred.resolve(copy);
                        break;
                    }
                }
                //as a safety precaution, just get the plantation details and not conditions
                //should display some error on the plantation page how data is not available
            } else {

                $http({
                        method: 'POST',
                        url: 'php/getIndividualPlantation.php',
                        data: str,
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
            }

            return deferred.promise;
        },

        //gets all condition levels for each plantation by date after picking from the datepicker
        getAllLevelsByDate: function (plant, date) {
            var i, arrayLevels = [],
                str = {
                    plantationID: encodeURIComponent(plant.plantationID),
                    date: encodeURIComponent(date)
                };

            return $http({
                    method: 'POST',
                    url: 'php/getAllConditionLevels.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        //var errMsg = "failed";
                        plant.conditionLevels = [];
                        //console.log(response.data);
                        return plant;
                    } else {
                        arrayLevels = angular.copy(response.data);
                        plant.conditionLevels = [];
                        for (i = 0; i < arrayLevels.length; i++) {
                            if (arrayLevels[i].plantationID === plant.plantationID) {
                                delete arrayLevels[i].plantationID;
                                plant.conditionLevels.push(arrayLevels[i]);
                            }
                        }
                    }
                    return plant;
                });
        },

        getAllLevels: function (plants, date) {
            var deferred = $q.defer(),
                plantsArray = angular.copy(plants),
                i, j, arrayLevels = [],
                str = {
                    date: encodeURIComponent(date)
                };

            $http({
                    method: 'POST',
                    url: 'php/getAllConditionLevels.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        //var errMsg = "failed";
                        for (i = 0; i < plantsArray.length; i++) {
                            plantsArray[i].conditionLevels = [];
                        }

                        allLevels = angular.copy(plantsArray);

                        deferred.resolve(plantsArray);

                    } else {
                        arrayLevels = angular.copy(response.data);

                        for (i = 0; i < plantsArray.length; i++) {
                            plantsArray[i].conditionLevels = [];
                            for (j = 0; j < arrayLevels.length; j++) {
                                if (arrayLevels[j].plantationID === plantsArray[i].plantationID) {
                                    delete arrayLevels[j].plantationID;
                                    plantsArray[i].conditionLevels.push(arrayLevels[j]);
                                }
                            }
                        }

                        allLevels = angular.copy(plantsArray);

                        deferred.resolve(plantsArray);
                    }
                });

            return deferred.promise;
        },

        getMonthlySummary: function (plants) {
            var deferred = $q.defer(),
                plantsArray = angular.copy(plants),
                i, j, arrayLevels = [],
                date = new Date(),
                str = {
                    month: encodeURIComponent(moment(date).month() + 1),
                    year: encodeURIComponent(moment(date).year())
                };

            $http({
                    method: 'POST',
                    url: 'php/getPlantConditionsByMonth.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        //var errMsg = "failed";
                        for (i = 0; i < plantsArray.length; i++) {
                            plantsArray[i].monthlySummary = [];
                        }
                        deferred.resolve(plantsArray);

                    } else {
                        arrayLevels = angular.copy(response.data);

                        for (i = 0; i < plantsArray.length; i++) {
                            plantsArray[i].monthlySummary = [];
                            for (j = 0; j < arrayLevels.length; j++) {
                                if (arrayLevels[j].plantationID === plantsArray[i].plantationID) {
                                    delete arrayLevels[j].plantationID;
                                    arrayLevels[j].avgLightIntensity = null;
                                    plantsArray[i].monthlySummary.push(arrayLevels[j]);
                                }
                            }
                        }

                        deferred.resolve(plantsArray);
                    }
                });

            return deferred.promise;
        },

        //gets monthly summary after picking the month from the datepicker in dashboard.monthlySummary
        getMonthlySummaryByDate: function (plants, date, type) {
            var plantsArray = angular.copy(plants),
                i, j, arrayLevels = [],
                str = {
                    month: encodeURIComponent(moment(date).month() + 1),
                    year: encodeURIComponent(moment(date).year()),
                    type: encodeURIComponent(type)
                };

            return $http({
                    method: 'POST',
                    url: 'php/getPlantConditionsByMonth.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        //var errMsg = "failed";
                        for (i = 0; i < plantsArray.length; i++) {
                            plantsArray[i].monthlySummary = [];
                        }

                    } else {
                        arrayLevels = angular.copy(response.data);

                        for (i = 0; i < plantsArray.length; i++) {
                            plantsArray[i].monthlySummary = [];
                            for (j = 0; j < arrayLevels.length; j++) {
                                if (arrayLevels[j].plantationID === plantsArray[i].plantationID) {
                                    delete arrayLevels[j].plantationID;
                                    plantsArray[i].monthlySummary.push(arrayLevels[j]);
                                }
                            }
                        }
                    }

                    return plantsArray;
                });
        },

        addEditYield: function (id, monthYear, yieldValue) {
            var date = moment(new Date(monthYear));
            var str = {
                plantationID: encodeURIComponent(id),
                date: encodeURIComponent(date.format('YYYY-MM-DD')),
                yieldValue: encodeURIComponent(yieldValue)
            };

            console.log(str);

            return $http({
                    method: 'POST',
                    url: 'php/addEditYield.php',
                    data: str,
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(function (response) {
                    if (response.data === "failed") {
                        return {
                            type: "failed",
                            msg: "Failed to save the yield value to the database"
                        };
                    } else {
                        return {
                            type: "success",
                            msg: "Successfully saved the yield value for "+monthYear+":"
                        };
                    }
                });
        },

        test: function () {
            var options = {
                method: 'POST',
                url: 'php/gatewayAPI.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            return $http(options)
                .then(function successCallback(response) {
                    console.log(response.data);
                }, function errorCallback(response) {
                    console.log("error", response.data);
                });

        }

    };

    return service;
});
