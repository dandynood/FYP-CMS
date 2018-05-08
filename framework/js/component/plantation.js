/*jslint white:true */
/*global angular */
/*global moment */
/*global alasql */
/*jslint plusplus:true*/
angular.module('mainApp').component('plantation', {
    templateUrl: 'template/plantation.html',
    bindings: {
        plantation: '<',
        optimumLevels: '<'
    },

    //Controller for individual plantation
    controllerAs: "model",
    controller: function ($scope, chartOptionsService, optimumLevelsService) {
        "use strict";
        var self = this;

        //Get all the necessary chart configurations for home page from the chartOptionsService
        //To change the configurations please refer to chartOptionsService and locate the name
        //or you can add or remove configurations on the $scope variable directly
        $scope.tempHumditiySeries = chartOptionsService.getSeriesLabel('tempHumidity');
        $scope.lightIntensitySeries = chartOptionsService.getSeriesLabel('lightIntensity');
        $scope.soilMoistureSeries = chartOptionsService.getSeriesLabel('soilMoisture');
        $scope.soilMoistureSeries = chartOptionsService.getSeriesLabel('soilMoisture');

        $scope.tempHumidityDatasetOverride = chartOptionsService.getDatasetOverride('tempHumidity');
        $scope.lightIntensityDatasetOverride = chartOptionsService.getDatasetOverride('lightIntensity');
        $scope.soilMoistureDatasetOverride = chartOptionsService.getDatasetOverride('soilMoisture');

        $scope.tempHumidityColors = chartOptionsService.getColor('tempHumidity');
        $scope.lightIntensityColors = chartOptionsService.getColor('lightIntensity');
        $scope.soilMoistureColors = chartOptionsService.getColor('soilMoisture');

        $scope.tempAndHumidityOptions = chartOptionsService.getOptions('tempHumidity');
        $scope.lightIntensityOptions = chartOptionsService.getOptions('lightIntensity');
        $scope.soilMoistureOptions = chartOptionsService.getOptions('soilMoisture');


        $scope.extractAirTempAndHumidity = function (conditions) {
            var data = [],
                humidity = [],
                airTemp = [],
                time = {},
                i;

            for (i = 0; i < conditions.length; i++) {
                time = {};
                time.x = conditions[i].dateTime;
                time.y = conditions[i].airTemp;
                airTemp.push(time);
            }

            for (i = 0; i < conditions.length; i++) {
                time = {};
                time.x = conditions[i].dateTime;
                time.y = conditions[i].humidity;
                humidity.push(time);
            }

            data.push(airTemp, humidity);
            return data;
        };

        $scope.extractLightIntensity = function (conditions) {
            var data = [],
                light = [],
                i, time;

            for (i = 0; i < conditions.length; i++) {
                time = {};
                time.x = conditions[i].dateTime;
                time.y = conditions[i].lightIntensity;
                light.push(time);
            }

            data.push(light);
            return data;

        };

        $scope.extractSoilMoisture = function (conditions) {
            var data = [],
                moisture = [],
                i, time;

            for (i = 0; i < conditions.length; i++) {
                time = {};
                time.x = conditions[i].dateTime;
                time.y = conditions[i].soilMoisture;
                moisture.push(time);
            }

            data.push(moisture);
            return data;

        };

        //Almost the same as home.js's controller $onInit but since it's one plantation
        //No for loops are required
        self.$onInit = function () {
            var last, lastPosition;
            $scope.plant = self.plantation;
            $scope.plant.optimumLevels = self.optimumLevels;

            $scope.plant.airTempAndHumidity = $scope.extractAirTempAndHumidity($scope.plant.conditionLevels);

            $scope.plant.lightIntensity = $scope.extractLightIntensity($scope.plant.conditionLevels);

            $scope.plant.soilMoisture = $scope.extractSoilMoisture($scope.plant.conditionLevels);

            if ($scope.plant.conditionLevels.length > 0) {
                lastPosition = $scope.plant.conditionLevels.length - 1;
            }

            last = $scope.plant.conditionLevels[lastPosition];

            if (last) {
                $scope.plant.airTempReport = optimumLevelsService.compareAirTemp(last.airTemp, $scope.plant.optimumLevels.airTemp);

                $scope.plant.humidityReport = optimumLevelsService.compareHumidity(last.humidity, $scope.plant.optimumLevels.humidity);

                $scope.plant.lightIntensityReport = optimumLevelsService.compareLightIntensity(last.lightIntensity, last.dateTime, $scope.plant.optimumLevels.lightIntensity);

                $scope.plant.soilMoistureReport = optimumLevelsService.compareSoilMoisture(last.soilMoisture, $scope.plant.optimumLevels.soilMoisture);
            }

            $scope.today = function () {
                $scope.selectedDate = new Date();
            };
            $scope.today();

            $scope.datePicker = {
                opened: false,
                format: 'dd-MMMM-yyyy',
                dateOptions: {
                    formatYear: 'yyyy',
                    startingDay: 1
                }
            };

            $scope.openDatePicker = function () {
                $scope.datePicker.opened = true;
            };

            $scope.sayHello = function (date) {
                console.log("hello", date);
            };
            
            $scope.exportDataToExcelStyle = {
                sheetid: 'Conditions ' + moment($scope.today).format("DD, MMMM YYYY HH:mm"),
                headers: true,
                caption: {
                    title: 'Daily Crop Conditions - created on: ' + moment($scope.today).format("DD, MMMM YYYY HH:mm")
                },
                style: 'background:#FFFFFF',
                column: {
                    style: function () {
                        return 'border: 1px green solid';
                    }
                },
                columns: [
                    {
                        columnid: 'PlantationID',
                        width: 200
                    },
                    {
                        columnid: 'PlantName',
                        width: 200
                    },
                    {
                        columnid: 'DateTime',
                        width: 300
                    },
                    {
                        columnid: 'AirTemp (C)',
                        width: 200
                    },
                    {
                        columnid: 'Humidity (%)',
                        width: 200
                    },
                    {
                        columnid: 'Light Intensity (Lux)',
                        width: 200
                    },
                    {
                        columnid: 'Soil Moisture (%)',
                        width: 200
                    }
                ],

                row: {
                    style: function () {
                        return 'border: green solid; width: 1px';
                    }
                }

            };

            
            $scope.exportAllDataToExcel = function () {
                var i, allDataToExport = [],
                    object = {},
                    plant = angular.copy($scope.plant),
                    name = plant.plantationID + ' Summary ' + moment($scope.selectedDate).format("DD-MMMM-YYYY") +'.xlsx';
                
                if (plant.conditionLevels.length > 0) {
                        for (i = 0; i < plant.conditionLevels.length; i++) {
                            object = {};
                            object = {
                                plantationID: plant.plantationID,
                                plantName: plant.plantName,
                                dateTime: plant.conditionLevels[i].dateTime,
                                airTemp: plant.conditionLevels[i].airTemp,
                                humidity: plant.conditionLevels[i].humidity,
                                lightIntensity: plant.conditionLevels[i].lightIntensity,
                                soilMoisture: plant.conditionLevels[i].soilMoisture
                            };
                            allDataToExport.push(object);
                        }
                    }

                alasql('SELECT * INTO XLSX(?,?) FROM ?', [name,$scope.exportDataToExcelStyle, allDataToExport]);
            };

        };

    }

});
