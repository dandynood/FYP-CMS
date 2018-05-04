/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').factory('optimumLevelsService', function ($http, $q) {
    "use strict";
    var allOptimumLevels,

        service = {
            getAllOptimumLevels: function (plantations) {
                var deferred = $q.defer(),
                    plants = angular.copy(plantations),
                    i, j, arrayLevels = [];

                if (angular.isDefined(allOptimumLevels)) {
                    deferred.resolve(allOptimumLevels);
                } else {

                    $http({
                            method: 'POST',
                            url: 'php/getAllOptimumLevels.php',
                            header: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                        .then(function (response) {
                            if (response.data === "failed") {
                                var errMsg = "failed";
                                arrayLevels.push(errMsg);
                            } else {
                                arrayLevels = angular.copy(response.data);

                                for (i = 0; i < plants.length; i++) {
                                    plants[i].optimumLevels = {};
                                    for (j = 0; j < arrayLevels.length; j++) {
                                        if (arrayLevels[j].plantationID === plants[i].plantationID) {
                                            delete arrayLevels[j].plantationID;
                                            plants[i].optimumLevels = arrayLevels[j];
                                            break;
                                        }
                                    }
                                }

                                allOptimumLevels = plants;

                                deferred.resolve(plants);
                            }
                        });
                }

                return deferred.promise;
            },

            getPlantationOptimumLevels: function (id) {
                var deferred = $q.defer(),
                    copy,
                    i,
                    str = {
                        plantationID: encodeURIComponent(id)
                    };

                if (angular.isDefined(allOptimumLevels)) {
                    for (i = 0; i < allOptimumLevels.length; i++) {
                        if (allOptimumLevels[i].plantationID === id) {
                            copy = angular.copy(allOptimumLevels[i]);
                            delete copy.plantationID;
                            delete copy.plantDescription;
                            delete copy.plantName;
                            deferred.resolve(copy.optimumLevels);
                            break;
                        }
                    }
                } else {

                    $http({
                            method: 'POST',
                            url: 'php/getOptimumLevels.php',
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

            compareAirTemp: function (lastCondition, optimum) {
                var minMax = optimum.split("-");

                if (lastCondition) {

                    if (lastCondition < minMax[0]) {
                        return {
                            status: "Low",
                            lastReading: lastCondition,
                            message: "Lower than minimum levels: " + minMax[0] + "%"
                        };
                    } else if (lastCondition > minMax[1]) {
                        return {
                            status: "High",
                            lastReading: lastCondition,
                            message: "Higher than the maximum levels: " + minMax[1] + "%"
                        };
                    } else {
                        return {
                            status: "Normal",
                            lastReading: lastCondition,
                            message: "Within optimum range"
                        };
                    }
                } else {
                    return {
                        status: "Not Available",
                        message: "Unfortunately no new data has been recieved"
                    };
                }

            },

            compareHumidity: function (lastCondition, optimum) {
                var minMax = optimum.split("-");

                if (lastCondition) {
                    if (lastCondition < minMax[0]) {
                        return {
                            status: "Low",
                            lastReading: lastCondition,
                            message: "Lower than minimum levels: " + minMax[0] + "%"
                        };
                    } else if (lastCondition > minMax[1]) {
                        return {
                            status: "High",
                            lastReading: lastCondition,
                            message: "Higher than the maximum levels: " + minMax[1] + "%"
                        };
                    } else {
                        return {
                            status: "Normal",
                            lastReading: lastCondition,
                            message: "Within optimum range"
                        };
                    }
                } else {
                    return {
                        status: "Not Available",
                        message: "Unfortunately no new data has been recieved"
                    };
                }

            },

            compareLightIntensity: function (lastCondition, dateTime, optimum) {
                //console.log(lastCondition, dateTime, optimum);
                var time = new Date(dateTime),
                    minMax = optimum.split("-");
                //console.log(time.getHours());


                if (time.getHours() >= 0 || time.getHours() <= 6 || time.getHours() >= 19 || time.getHours() <= 23) {
                    //console.log("hello");
                    return {
                        status: "Normal",
                        lastReading: lastCondition,
                        message: "It's night time!",
                        dayOrNight: "Night"
                    };
                }

                if (lastCondition) {
                    if (lastCondition < minMax[0]) {
                        return {
                            status: "Low",
                            lastReading: lastCondition,
                            message: "Lower than minimum levels: " + minMax[0] + "%",
                            dayOrNight: "Day"
                        };
                    } else if (lastCondition > minMax[1]) {
                        return {
                            status: "High",
                            lastReading: lastCondition,
                            message: "Higher than the maximum levels: " + minMax[1] + "%",
                            dayOrNight: "Day"
                        };
                    } else {
                        return {
                            status: "Normal",
                            lastReading: lastCondition,
                            message: "Within optimum range",
                            dayOrNight: "Day"
                        };
                    }
                } else {
                    return {
                        status: "Not Available",
                        message: "Unfortunately no new data has been recieved"
                    };
                }
            },

            compareSoilMoisture: function (lastCondition, optimum) {
                var minMax = optimum.split("-");
                //console.log(lastCondition);
                if (lastCondition) {
                    if (lastCondition < minMax[0]) {
                        return {
                            status: "Low",
                            lastReading: lastCondition,
                            message: "Lower than minimum levels: " + minMax[0] + "%"
                        };
                    } else if (lastCondition > minMax[1]) {
                        return {
                            status: "High",
                            lastReading: lastCondition,
                            message: "Higher than the maximum levels: " + minMax[1] + "%"
                        };
                    } else {
                        return {
                            status: "Normal",
                            lastReading: lastCondition,
                            message: "Within optimum range"
                        };
                    }
                } else {
                    return {
                        status: "Not Available",
                        message: "Unfortunately no new data has been recieved"
                    };
                }

            }
        };

    return service;

});
