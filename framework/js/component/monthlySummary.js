/*jslint white:true */
/*global angular */
/*global moment */
/*global alasql */
/*jslint plusplus:true*/
angular.module('mainApp').component('monthlySummary', {
    templateUrl: 'template/monthlySummary.html',
    bindings: {
        monthlySummaryConditions: '<',
        optimumLevels: '<'
    },

    controller: function ($scope, chartOptionsService, optimumLevelsService, plantationService) {
        "use strict";
        var self = this;

        //Get all the necessary chart configurations for home page from the chartOptionsService
        //To change the configurations please refer to chartOptionsService and locate the name
        //or you can add or remove configurations on the $scope variable directly
        $scope.tempHumditiyLabels = chartOptionsService.getSeriesLabel('tempHumidity');
        $scope.lightIntensityLabels = chartOptionsService.getSeriesLabel('lightIntensity');
        $scope.soilMoistureLabels = chartOptionsService.getSeriesLabel('soilMoisture');

        $scope.tempHumidityDatasetOverride = chartOptionsService.getDatasetOverride('tempHumidity');
        $scope.lightIntensityDatasetOverride = chartOptionsService.getDatasetOverride('lightIntensity');
        $scope.soilMoistureDatasetOverride = chartOptionsService.getDatasetOverride('soilMoisture');

        $scope.tempHumidityColors = chartOptionsService.getColor('tempHumidity');
        $scope.lightIntensityColors = chartOptionsService.getColor('lightIntensity');
        $scope.soilMoistureColors = chartOptionsService.getColor('soilMoisture');

        $scope.tempAndHumidityOptions = chartOptionsService.getOptions('tempHumidity');
        $scope.lightIntensityOptions = chartOptionsService.getOptions('lightIntensity');
        $scope.soilMoistureOptions = chartOptionsService.getOptions('soilMoisture');

        $scope.tempAndHumidityOptions.scales.xAxes[0].time.unit = 'week';
        $scope.lightIntensityOptions.scales.xAxes[0].time.unit = 'week';
        $scope.soilMoistureOptions.scales.xAxes[0].time.unit = 'week';

        //Below methods are used to extract individual conditions for display on graphs
        //from the monthlySummaryConditions binding that has all the conditions for each plantation
        $scope.extractAirTempAndHumidity = function (conditions) {
            var data = [],
                humidity = [],
                airTemp = [],
                time = {},
                i;

            for (i = 0; i < conditions.length; i++) {
                time = {};
                time.x = conditions[i].date;
                time.y = conditions[i].avgAirTemp;
                airTemp.push(time);
            }

            for (i = 0; i < conditions.length; i++) {
                time = {};
                time.x = conditions[i].date;
                time.y = conditions[i].avgHumidity;
                humidity.push(time);
            }

            if (airTemp.length === 0 && humidity.length === 0) {
                data = [];
            } else {
                data.push(airTemp, humidity);
            }
            return data;
        };

        $scope.extractLightIntensity = function (conditions) {
            var data = [],
                light = [],
                i, time;

            for (i = 0; i < conditions.length; i++) {
                time = {};
                time.x = conditions[i].date;
                time.y = conditions[i].avgLightIntensity;
                light.push(time);
            }

            if (light.length === 0) {
                data = [];
            } else {
                data.push(light);
            }
            return data;

        };

        $scope.extractSoilMoisture = function (conditions) {
            var data = [],
                moisture = [],
                i, time;

            for (i = 0; i < conditions.length; i++) {
                time = {};
                time.x = conditions[i].date;
                time.y = conditions[i].avgSoilMoisture;
                moisture.push(time);
            }

            if (moisture.length === 0) {
                data = [];
            } else {
                data.push(moisture);
            }
            return data;

        };

        //This function is called when you look at past data
        //It averages out the whole data of the month and compares it with the optimum ranges as a summary
        $scope.getAvgMonthlyConditions = function (conditions) {
            var i, averageCondtions = {},
                airTemp = 0,
                humidity = 0,
                lightIntensity = 0,
                soilMoisture = 0,
                count = 0;

            if (conditions.length === 0) {
                return {
                    dateTime: null,
                    airTemp: null,
                    humidity: null,
                    lightIntensity: null,
                    soilMoisture: null
                };
            }

            for (i = 0; i < conditions.length; i++) {
                airTemp = airTemp + parseFloat(conditions[i].avgAirTemp);
                humidity = humidity + parseFloat(conditions[i].avgHumidity);
                lightIntensity = lightIntensity + parseFloat(conditions[i].avgLightIntensity);
                soilMoisture = soilMoisture + parseFloat(conditions[i].avgSoilMoisture);
                count++;
            }

            airTemp = airTemp / count;
            humidity = humidity / count;
            lightIntensity = lightIntensity / count;
            soilMoisture = soilMoisture / count;

            averageCondtions = {
                dateTime: null,
                airTemp: parseFloat(airTemp).toFixed(1),
                humidity: parseFloat(humidity).toFixed(1),
                lightIntensity: parseFloat(lightIntensity).toFixed(1),
                soilMoisture: parseFloat(soilMoisture).toFixed(1)
            };

            return averageCondtions;
        };

        this.$onInit = function () {
            var i, j,
                plants = self.monthlySummaryConditions,
                optimumLevels = self.optimumLevels;

            $scope.plantations = angular.copy(plants);

            $scope.initializeOrganization = function () {
                //Here we copy the conditions into $scope
                //Then we simply add new attributes in each plantation object in the array
                //these attributes are the conditions that are seperated from monthlySummary
                //using the methods above to extract them
                for (i = 0; i < $scope.plantations.length; i++) {
                    $scope.plantations[i].airTempandHumidity = $scope.extractAirTempAndHumidity($scope.plantations[i].monthlySummary);
                    $scope.plantations[i].lightIntensity = $scope.extractLightIntensity($scope.plantations[i].monthlySummary);
                    $scope.plantations[i].soilMoisture = $scope.extractSoilMoisture($scope.plantations[i].monthlySummary);

                }

                //then we retrieve the optimum levels, from the binding, via ID lookup
                //compare between $scope.plantations and optimumlevels
                for (i = 0; i < $scope.plantations.length; i++) {
                    $scope.plantations[i].optimumLevels = {};
                    for (j = 0; j < optimumLevels.length; j++) {
                        if (optimumLevels[j].plantationID === $scope.plantations[i].plantationID) {
                            $scope.plantations[i].optimumLevels = angular.copy(optimumLevels[j].optimumLevels);
                            break;
                        }
                    }
                }
            };

            $scope.initializeOrganization();

            $scope.getMonthlySummary = function () {
                var avgMonthlyCondtions;
                for (i = 0; i < $scope.plantations.length; i++) {

                    avgMonthlyCondtions = $scope.getAvgMonthlyConditions($scope.plantations[i].monthlySummary);

                    $scope.plantations[i].airTempReport = optimumLevelsService.compareAirTemp(avgMonthlyCondtions.airTemp, $scope.plantations[i].optimumLevels.airTemp);
                    $scope.plantations[i].humidityReport = optimumLevelsService.compareHumidity(avgMonthlyCondtions.humidity, $scope.plantations[i].optimumLevels.humidity);
                    $scope.plantations[i].lightIntensityReport = optimumLevelsService.compareLightIntensity(avgMonthlyCondtions.lightIntensity, avgMonthlyCondtions.dateTime, $scope.plantations[i].optimumLevels.lightIntensity);
                    $scope.plantations[i].soilMoistureReport = optimumLevelsService.compareSoilMoisture(avgMonthlyCondtions.soilMoisture, $scope.plantations[i].optimumLevels.soilMoisture);
                    
                    $scope.plantations[i].airTempReport.chartSettings.seriesLabel[2] = 'Monthly Average';
                    $scope.plantations[i].airTempReport.chartSettings.labels[1] = 'Monthly Average';
                    
                    $scope.plantations[i].humidityReport.chartSettings.seriesLabel[2] = 'Monthly Average';
                    $scope.plantations[i].humidityReport.chartSettings.labels[1] = 'Monthly Average';
                
                    $scope.plantations[i].lightIntensityReport.chartSettings.seriesLabel[2] = 'Monthly Average';
                    $scope.plantations[i].lightIntensityReport.chartSettings.labels[1] = 'Monthly Average';
                    
                    $scope.plantations[i].soilMoistureReport.chartSettings.seriesLabel[2] = 'Monthly Average';
                    $scope.plantations[i].soilMoistureReport.chartSettings.labels[1] = 'Monthly Average';
                
                
                }
            };

            $scope.getMonthlySummary();

            $scope.getPlant = function (id) {
                var i;
                for (i = 0; i < $scope.plantations.length; i++) {
                    if ($scope.plantations[i].plantationID === id) {
                        $scope.plant = $scope.plantations[i];
                        break;
                    }
                }
                return 0;
            };

            //This is used in the $scope.exportDataToExcelStyle to show the date of excel creation
            //This gets the date for today
            //SelectedDate will change, $scope.today is for reference of today
            //This is in case you pick the today date on the datepicker to get back the last recording data
            //These are also used to put dates the excel files $scope.exportDataToExcelStyle
            $scope.selectedDate = new Date();
            $scope.today = new Date();

            $scope.datePicker = {
                opened: false,
                format: 'MMM yyyy',
                dateOptions: {
                    minMode: 'month',
                    formatYear: 'yyyy'
                }
            };

            $scope.openDatePicker = function () {
                $scope.datePicker.opened = true;
            };

            //For text change for the headers above the summary table
            $scope.comparisonType = "Normal";

            $scope.getMonthConditions = function (date) {
                var today = moment($scope.today).format("YYYY-MM"),
                    plantation,
                    promise;

                console.log($scope.plantations);

                date = moment(date).format("YYYY-MM");

                if (moment(date).isSame(today)) {
                    $scope.comparisonType = "Normal";
                } else if (moment(date).isBefore(today)) {
                    $scope.comparisonType = "Past";
                }

                plantation = angular.copy(self.monthlySummaryConditions);
                promise = plantationService.getMonthlySummaryByDate(plantation, date);

                promise.then(function (data) {
                    $scope.plantations = angular.copy(data);
                    $scope.initializeOrganization();
                    $scope.getMonthlySummary();

                    console.log($scope.plantations);
                });
            };

            $scope.exportDataToExcelStyle = {
                sheetid: 'Avg per day in ' + moment($scope.selectedDate).format("MMMM YYYY"),
                headers: true,
                caption: {
                    title: 'Monthly Summary - created on: ' + moment($scope.today).format("DD, MMMM YYYY HH:mm")
                },
                column: {
                    style: function () {
                        return 'border: 1px green solid';
                    }
                },
                columns: [
                    {
                        columnid: 'plantationID',
                        title: 'Plantation ID',
                        width: 100
                    },
                    {
                        columnid: 'plantName',
                        title: 'Plant name',
                        width: 100
                    },
                    {
                        columnid: 'date',
                        title: 'Date',
                        width: 100
                    },
                    {
                        columnid: 'airTemp',
                        title: 'Avg Air Temp (C)',
                        width: 110
                    },
                    {
                        columnid: 'humidity',
                        title: 'Avg Humidity (%)',
                        width: 110
                    },
                    {
                        columnid: 'lightIntensity',
                        title: 'Avg Light Intensity (Lux)',
                        width: 150
                    },
                    {
                        columnid: 'soilMoisture',
                        title: 'Avg Soil Moisture (%)',
                        width: 150
                    }
                ]

            };

            $scope.exportAllDataToExcel = function () {
                var i, j, allDataToExport = [],
                    object = {},
                    plants = angular.copy($scope.plantations);
                for (i = 0; i < plants.length; i++) {
                    if (plants[i].monthlySummary.length > 0) {
                        for (j = 0; j < plants[i].monthlySummary.length; j++) {
                            object = {};
                            object = {
                                plantationID: plants[i].plantationID,
                                plantName: plants[i].plantName,
                                date: plants[i].monthlySummary[j].date,
                                airTemp: plants[i].monthlySummary[j].avgAirTemp,
                                humidity: plants[i].monthlySummary[j].avgHumidity,
                                lightIntensity: plants[i].monthlySummary[j].avgLightIntensity,
                                soilMoisture: plants[i].monthlySummary[j].avgSoilMoisture
                            };
                            allDataToExport.push(object);
                        }
                    }
                }

                alasql('SELECT * INTO XLS("Monthly Summary.xls",?) FROM ?', [$scope.exportDataToExcelStyle, allDataToExport]);
            };

            $scope.exportPlantDataToExcel = function (plant) {
                var i, allDataToExport = [],
                    name = plant.plantationID + ' Monthly Summary.xls',
                    object = {};

                if (plant.monthlySummary.length > 0) {
                    for (i = 0; i < plant.monthlySummary.length; i++) {
                        object = {};
                        object = {
                            plantationID: plant.plantationID,
                            plantName: plant.plantName,
                            date: plant.monthlySummary[i].date,
                            airTemp: plant.monthlySummary[i].avgAirTemp,
                            humidity: plant.monthlySummary[i].avgHumidity,
                            lightIntensity: plant.monthlySummary[i].avgLightIntensity,
                            soilMoisture: plant.monthlySummary[i].avgSoilMoisture
                        };
                        allDataToExport.push(object);
                    }
                }

                alasql('SELECT * INTO XLS(?,?) FROM ?', [name, $scope.exportDataToExcelStyle, allDataToExport]);
            };
        };
    }

});
