/*jslint white:true */
/*global angular */
/*global moment */
/*jslint plusplus:true*/
angular.module('mainApp').factory('optimumLevelsService', function ($http, $q, chartOptionsService) {
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
                var minMax = optimum.split("-"),
                chartSettings = angular.copy(chartOptionsService.getOptimumSettings('optimumLevels'));
                
                chartSettings.options.scales.xAxes[0].scaleLabel.labelString = 'Air Temperature (C)';

                if (lastCondition) {

                    if (lastCondition < minMax[0]) {
                        return {
                            status: "Low",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#31708f'],
                            chartSettings: chartSettings,
                            message: "Lower than minimum levels: " + minMax[0] + " C"
                        };
                    } else if (lastCondition > minMax[1]) {
                        return {
                            status: "High",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#a94442'],
                            chartSettings: chartSettings,
                            message: "Higher than the maximum levels: " + minMax[1] + " C"
                        };
                    } else {
                        return {
                            status: "Normal",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#3c763d'],
                            chartSettings: chartSettings,
                            message: "Within optimum range"
                        };
                    }
                } else {
                    return {
                        status: "Not Available",
                        chartData: [[minMax[0],0],[minMax[1],0]],
                        chartColors: ['#0201EF', '#3c763d'],
                        chartSettings: chartSettings,
                        message: "Unfortunately no new data has been recieved"
                    };
                }

            },

            compareHumidity: function (lastCondition, optimum) {
                var minMax = optimum.split("-"),
                    chartSettings = angular.copy(chartOptionsService.getOptimumSettings('optimumLevels'));
                
                chartSettings.options.scales.xAxes[0].scaleLabel.labelString = 'Humidity (%)';

                if (lastCondition) {
                    if (lastCondition < minMax[0]) {
                        return {
                            status: "Low",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#31708f'],
                            chartSettings: chartSettings,
                            message: "Lower than minimum levels: " + minMax[0] + "%"
                        };
                    } else if (lastCondition > minMax[1]) {
                        return {
                            status: "High",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#a94442'],
                            chartSettings: chartSettings,
                            message: "Higher than the maximum levels: " + minMax[1] + "%"
                        };
                    } else {
                        return {
                            status: "Normal",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#3c763d'],
                            chartSettings: chartSettings,
                            message: "Within optimum range"
                        };
                    }
                } else {
                    return {
                        status: "Not Available",
                        chartData: [[minMax[0],0],[minMax[1],0]],
                        chartColors: ['#0201EF', '#3c763d'],
                        chartSettings: chartSettings,
                        message: "Unfortunately no new data has been recieved"
                    };
                }

            },

            compareLightIntensity: function (lastCondition, dateTime, optimum) {
                //console.log(lastCondition, dateTime, optimum);
                var hour = moment(dateTime).hour(),
                    minMax = optimum.split("-"),
                    chartSettings = angular.copy(chartOptionsService.getOptimumSettings('optimumLevels'));
                
                chartSettings.options.scales.xAxes[0].scaleLabel.labelString = 'Light Intensity (Lux)';
                
                //This first determines if the time of the reading is night time
                //12am to 6am is not considered, so is 7pm to 11pm
                if (dateTime && (hour >= 0 || hour <= 6 || hour >= 19 || hour <= 23)) {
                    return {
                        status: "Normal",
                        lastReading: lastCondition,
                        chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                        chartColors: ['#0201EF', '#3c763d','#3c763d'],
                        chartSettings: chartSettings,
                        message: "It's night time!",
                        dayOrNight: "Night"
                    };
                }

                //if it's day time, 7am to 6am, then get comparison report
                if (lastCondition) {
                    if (lastCondition < minMax[0]) {
                        return {
                            status: "Low",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#31708f'],
                            chartSettings: chartSettings,
                            message: "Lower than minimum levels: " + minMax[0] + " Lux",
                            dayOrNight: "Day"
                        };
                    } else if (lastCondition > minMax[1]) {
                        return {
                            status: "High",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#a94442'],
                            chartSettings: chartSettings,
                            message: "Higher than the maximum levels: " + minMax[1] + " Lux",
                            dayOrNight: "Day"
                        };
                    } else {
                        return {
                            status: "Normal",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#3c763d'],
                            chartSettings: chartSettings,
                            message: "Within optimum range",
                            dayOrNight: "Day"
                        };
                    }
                } else {
                    return {
                        status: "Not Available",
                        chartData: [[minMax[0],0],[minMax[1],0]],
                        chartColors: ['#0201EF', '#3c763d'],
                        chartSettings: chartSettings,
                        message: "Unfortunately no new data has been recieved"
                    };
                }
            },

            compareSoilMoisture: function (lastCondition, optimum) {
                var minMax = optimum.split("-"),
                chartSettings = angular.copy(chartOptionsService.getOptimumSettings('optimumLevels'));
                
                chartSettings.options.scales.xAxes[0].scaleLabel.labelString = 'Soil Moisture (%)';
                
                if (lastCondition) {
                    if (lastCondition < minMax[0]) {
                        return {
                            status: "Low",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#31708f'],
                            chartSettings: chartSettings,
                            message: "Lower than minimum levels: " + minMax[0] + "%"
                        };
                    } else if (lastCondition > minMax[1]) {
                        return {
                            status: "High",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartSettings: chartSettings,
                            message: "Higher than the maximum levels: " + minMax[1] + "%"
                        };
                    } else {
                        return {
                            status: "Normal",
                            lastReading: lastCondition,
                            chartData: [[minMax[0],0],[minMax[1],0],[0,lastCondition]],
                            chartColors: ['#0201EF', '#3c763d','#3c763d'],
                            chartSettings: chartSettings,
                            message: "Within optimum range"
                        };
                    }
                } else {
                    return {
                        status: "Not Available",
                        chartData: [[minMax[0],0],[minMax[1],0]],
                        chartColors: ['#0201EF', '#3c763d'],
                        chartSettings: chartSettings,
                        message: "Unfortunately no new data has been recieved"
                    };
                }

            }
        };

    return service;

});
