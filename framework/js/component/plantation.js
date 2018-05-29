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
    controller: function ($scope, chartOptionsService, optimumLevelsService, plantationService) {
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

        $scope.tempAndHumidityOptions.scales.xAxes[0].time.unit = 'hour';
        $scope.lightIntensityOptions.scales.xAxes[0].time.unit = 'hour';
        $scope.soilMoistureOptions.scales.xAxes[0].time.unit = 'hour';


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

        //This function is called when you look at past data
        //It averages out the whole data of that date and compares it with the optimum ranges as a summary
        $scope.getAverageConditions = function (conditions) {
            var i, averageCondtions = {},
                airTemp = 0,
                humidity = 0,
                lightIntensity = 0,
                soilMoisture = 0,
                reduceCountAT = 0,
                reduceCountH = 0,
                reduceCountLI = 0,
                reduceCountSM = 0,
                count = 0,
                countLightIntensity = 0;

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
                if (conditions[i].airTemp !== null) {
                    airTemp = airTemp + (+conditions[i].airTemp);
                } else {
                    reduceCountAT++;
                }
                if (conditions[i].humidity !== null) {
                    humidity = humidity + (+conditions[i].humidity);
                } else {
                    reduceCountH++;
                }
                if (conditions[i].lightIntensity !== null) {
                    //Get only values for lightIntensity within 7am and 6pm only for average
                    //Also the countLightIntensity is only used to average out lightIntensity (counts the light readings in the day range)
                    if (conditions[i].dateTime && (moment(conditions[i].dateTime).hour() >= 7 && moment(conditions[i].dateTime).hour() <= 18)) {
                        countLightIntensity++;
                        lightIntensity = lightIntensity + (+conditions[i].lightIntensity);
                    }
                    
                } else {
                    reduceCountLI++;
                }
                if (conditions[i].soilMoisture !== null) {
                    soilMoisture = soilMoisture + (+conditions[i].soilMoisture);
                } else {
                    reduceCountSM++;
                }
                
                count++;
            }

            airTemp = (count!==reduceCountAT? airTemp / (count - reduceCountAT): null);
            humidity = (count!==reduceCountH? humidity / (count - reduceCountH): null);
            lightIntensity = (countLightIntensity!==reduceCountLI ? lightIntensity / (countLightIntensity - reduceCountLI): null);
            soilMoisture = (count!==reduceCountSM ? soilMoisture / (count - reduceCountSM): null);
            
            averageCondtions = {
                dateTime: null,
                airTemp: (airTemp!==null? airTemp.toFixed(1):airTemp),
                humidity: (humidity!==null? humidity.toFixed(1):humidity),
                lightIntensity: (lightIntensity!==null? lightIntensity.toFixed(1):lightIntensity),
                soilMoisture: (soilMoisture!==null? soilMoisture.toFixed(1):soilMoisture)
            };

            //console.log(averageCondtions);

            return averageCondtions;
        };

        //Almost the same as home.js's controller $onInit but since it's one plantation
        //No for loops are required
        self.$onInit = function () {
            $scope.plant = angular.copy(self.plantation);
            //since there is only plantation selected, we just simply put the optimum levels like so
            $scope.plant.optimumLevels = angular.copy(self.optimumLevels);

            //extract the conditions and place them in seperate attributes for each parameter for ease of access and use
            //used also for the chart drawings
            $scope.plant.airTempAndHumidity = $scope.extractAirTempAndHumidity($scope.plant.conditionLevels);
            $scope.plant.lightIntensity = $scope.extractLightIntensity($scope.plant.conditionLevels);
            $scope.plant.soilMoisture = $scope.extractSoilMoisture($scope.plant.conditionLevels);

            //Initializes the optimum level comparison reports, where we get the last recording of the condition levels
            //Compares that recording with the optimum range to get comparison reports for table and graph in the modal when View is clicked
            //is called when loading this page or when the date is selected by again for today in the datepicker
            $scope.getLastComparisonReports = function () {
                var last, lastPosition;
                if ($scope.plant.conditionLevels.length > 0) {
                    lastPosition = $scope.plant.conditionLevels.length - 1;
                    last = $scope.plant.conditionLevels[lastPosition];
                } else {
                    last = {
                        dateTime: null,
                        airTemp: null,
                        humidity: null,
                        lightIntensity: null,
                        soilMoisture: null
                    };
                }

                if (last) {
                    $scope.plant.airTempReport = optimumLevelsService.compareAirTemp(last.airTemp, $scope.plant.optimumLevels.airTemp);

                    $scope.plant.humidityReport = optimumLevelsService.compareHumidity(last.humidity, $scope.plant.optimumLevels.humidity);

                    $scope.plant.lightIntensityReport = optimumLevelsService.compareLightIntensity(last.lightIntensity, last.dateTime, $scope.plant.optimumLevels.lightIntensity);

                    $scope.plant.soilMoistureReport = optimumLevelsService.compareSoilMoisture(last.soilMoisture, $scope.plant.optimumLevels.soilMoisture);
                }
            };

            $scope.getLastComparisonReports();
            
            //console.log($scope.plant.soilMoisture);

            //This gets the date for today
            //SelectedDate will change, $scope.today is for reference of today
            //This is in case you pick the today date on the datepicker to get back the last recording data
            $scope.selectedDate = new Date();
            $scope.today = new Date();

            $scope.datePicker = {
                opened: false,
                format: 'dd MMMM yyyy',
                dateOptions: {
                    formatYear: 'yyyy',
                    startingDay: 1
                }
            };

            $scope.openDatePicker = function () {
                $scope.datePicker.opened = true;
            };

            //For text change for the headers above the summary table
            $scope.comparisonType = "Normal";

            //This queries the data from the selected date in the date picker
            //Notice how we average the past recordings for the day since they are past
            //For present we look only at the last recording to get the latest updates of today
            $scope.getDateConditions = function (date) {
                var today = moment($scope.today).format("YYYY-MM-DD"),
                    plantation,
                    averageConditions,
                    promise;

                date = moment(date).format("YYYY-MM-DD");

                if (moment(date).isSame(today)) {
                    $scope.comparisonType = "Normal";

                    $scope.plant = angular.copy(self.plantation);
                    $scope.plant.optimumLevels = angular.copy(self.optimumLevels);

                    $scope.plant.airTempAndHumidity = $scope.extractAirTempAndHumidity($scope.plant.conditionLevels);
                    $scope.plant.lightIntensity = $scope.extractLightIntensity($scope.plant.conditionLevels);
                    $scope.plant.soilMoisture = $scope.extractSoilMoisture($scope.plant.conditionLevels);

                    $scope.getLastComparisonReports();

                } else {
                    if (moment(date).isBefore(today)) {
                        $scope.comparisonType = "Past";
                    }

                    plantation = angular.copy(self.plantation);
                    promise = plantationService.getAllLevelsByDate(plantation, date);

                    promise.then(function (data) {

                        $scope.plant = angular.copy(data);
                        $scope.plant.optimumLevels = angular.copy(self.optimumLevels);

                        $scope.plant.airTempAndHumidity = $scope.extractAirTempAndHumidity($scope.plant.conditionLevels);
                        $scope.plant.lightIntensity = $scope.extractLightIntensity($scope.plant.conditionLevels);
                        $scope.plant.soilMoisture = $scope.extractSoilMoisture($scope.plant.conditionLevels);

                        averageConditions = $scope.getAverageConditions($scope.plant.conditionLevels);

                        $scope.plant.airTempReport = optimumLevelsService.compareAirTemp(averageConditions.airTemp, $scope.plant.optimumLevels.airTemp);
                        $scope.plant.humidityReport = optimumLevelsService.compareHumidity(averageConditions.humidity, $scope.plant.optimumLevels.humidity);
                        $scope.plant.lightIntensityReport = optimumLevelsService.compareLightIntensity(averageConditions.lightIntensity, averageConditions.dateTime, $scope.plant.optimumLevels.lightIntensity);
                        $scope.plant.soilMoistureReport = optimumLevelsService.compareSoilMoisture(averageConditions.soilMoisture, $scope.plant.optimumLevels.soilMoisture);

                    });
                }
            };

            //The excel worksheet styling that is used when exporting data to excel in the alasql
            $scope.exportDataToExcelStyle = {
                sheetid: 'Conditions ' + moment($scope.selectedDate).format("DD, MMMM YYYY"),
                headers: true,
                caption: {
                    title: ''
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
                        columnid: 'dateTime',
                        title: 'DateTime',
                        width: 150
                    },
                    {
                        columnid: 'airTemp',
                        title: 'Air Temp (C)',
                        width: 100
                    },
                    {
                        columnid: 'humidity',
                        title: 'Humidity (%)',
                        width: 100
                    },
                    {
                        columnid: 'lightIntensity',
                        title: 'Light Intensity (Lux)',
                        width: 150
                    },
                    {
                        columnid: 'soilMoisture',
                        title: 'Soil Moisture (%)',
                        width: 150
                    }
                ]

            };

            
            //Exports all the data for the whole selected day of this plantation
            $scope.exportAllDataToExcel = function () {
                var i, allDataToExport = [],
                    object = {},
                    plant = angular.copy($scope.plant),
                    name = plant.plantationID + ' Summary ' + moment($scope.selectedDate).format("DD-MMMM-YYYY") + '.xls';

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
                
                $scope.exportDataToExcelStyle.caption.title = "Daily Crop Conditions - created on: " + moment($scope.selectedDate).format("DD MMMM YYYY HH:mm");
                
                $scope.exportDataToExcelStyle.sheetid = 'Conditions ' + moment($scope.selectedDate).format("DD MMMM YYYY");

                alasql('SELECT * INTO XLS(?,?) FROM ?', [name, $scope.exportDataToExcelStyle, allDataToExport]);
            };

        };

    }

});
