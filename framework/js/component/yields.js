/*jslint white:true */
/*global angular */
/*global moment */
/*global alasql */
/*jslint plusplus:true*/
angular.module('mainApp').component('yields', {
    templateUrl: 'template/yields.html',
    bindings: {
        monthlySummaryYields: '<',
        optimumLevels: '<'
    },

    controller: function ($scope, chartOptionsService, optimumLevelsService, plantationService) {
        "use strict";
        var self = this;

        self.$onInit = function () {
            var i, j,
                plants = this.monthlySummaryYields,
                optimumLevels = this.optimumLevels;
            $scope.plantations = angular.copy(plants);
            //console.log($scope.plantations);

            $scope.initializeOrganization = function () {
                for (i = 0; i < $scope.plantations.length; i++) {
                    $scope.plantations[i].optimumLevels = {};
                    for (j = 0; j < optimumLevels.length; j++) {
                        if (optimumLevels[j].plantationID === $scope.plantations[i].plantationID) {
                            $scope.plantations[i].optimumLevels = optimumLevels[j].optimumLevels;
                            break;
                        }
                    }
                }
            };

            $scope.getMonthlySummary = function () {
                var avgMonthlyCondtions;
                for (i = 0; i < $scope.plantations.length; i++) {
                    avgMonthlyCondtions = [];

                    if ($scope.plantations[i].monthlySummary[0]) {
                        avgMonthlyCondtions = $scope.plantations[i].monthlySummary[0];
                    }

                    $scope.plantations[i].airTempReport = optimumLevelsService.compareAirTemp(avgMonthlyCondtions.avgAirTemp, $scope.plantations[i].optimumLevels.airTemp);
                    $scope.plantations[i].humidityReport = optimumLevelsService.compareHumidity(avgMonthlyCondtions.avgHumidity, $scope.plantations[i].optimumLevels.humidity);
                    $scope.plantations[i].lightIntensityReport = optimumLevelsService.compareLightIntensity(avgMonthlyCondtions.avgLightIntensity, avgMonthlyCondtions.dateTime, $scope.plantations[i].optimumLevels.lightIntensity);
                    $scope.plantations[i].soilMoistureReport = optimumLevelsService.compareSoilMoisture(avgMonthlyCondtions.avgSoilMoisture, $scope.plantations[i].optimumLevels.soilMoisture);

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

            $scope.initializeOrganization();
            $scope.getMonthlySummary();

            $scope.addEditYield = false;

            $scope.openAddEditYieldField = function () {
                $scope.addEditYield = true;
            };

            $scope.getPlant = function (id) {
                var i;
                for (i = 0; i < $scope.plantations.length; i++) {
                    if ($scope.plantations[i].plantationID === id) {
                        $scope.plant = angular.copy($scope.plantations[i]);
                        break;
                    }
                }
                return 0;
            };

            $scope.getYieldForEdit = function (id) {
                var i;
                $scope.AddEditMessage = null;
                for (i = 0; i < $scope.plantations.length; i++) {
                    if ($scope.plantations[i].plantationID === id) {
                        $scope.plant = angular.copy($scope.plantations[i]);
                        if ($scope.plant.monthlySummary[0].yieldValue !== null) {
                            $scope.formType = "Edit";
                        } else {
                            $scope.formType = "Add";
                        }
                        break;
                    }
                }
            };

            $scope.saveYieldValue = function (plant) {
                var i, yieldValue = plant.monthlySummary[0].yieldValue,
                    id = plant.plantationID,
                    date = plant.monthlySummary[0].date,
                    promise;
                for (i = 0; i < $scope.plantations.length; i++) {
                    if ($scope.plantations[i].plantationID === id) {
                        $scope.plantations[i].monthlySummary[0].yieldValue = yieldValue;
                        break;
                    }
                }

                promise = plantationService.addEditYield(id, date, yieldValue);

                promise.then(function (data) {
                    $scope.AddEditMessage = data;
                });
            };

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

            //Options/settings for the datepicker
            $scope.datePicker = {
                opened: false,
                format: 'MMM yyyy',
                dateOptions: {
                    minMode: 'month',
                    formatYear: 'yyyy'
                }
            };

            //function to open the datepicker when the button next to it is clicked
            $scope.openDatePicker = function () {
                $scope.datePicker.opened = true;
            };

            //For text change for the headers above the summary table
            $scope.comparisonType = "Normal";

            //After clicking a month on the datepicker it will query the data from that month
            //uses the plnatationService.getMonthlySummaryByDate function
            $scope.getMonthYields = function (date) {
                var today = moment($scope.today).format("YYYY-MM"),
                    plantation,
                    promise;

                date = moment(date).format("YYYY-MM");

                if (moment(date).isSame(today)) {
                    $scope.comparisonType = "Normal";
                } else if (moment(date).isBefore(today)) {
                    $scope.comparisonType = "Past";
                }

                plantation = angular.copy(self.monthlySummaryYields);
                promise = plantationService.getMonthlySummaryByDate(plantation, date, "yield");

                promise.then(function (data) {
                    $scope.plantations = angular.copy(data);
                    $scope.initializeOrganization();
                    $scope.getMonthlySummary();
                    //console.log($scope.plantations);
                });
            };

            //For the exportAllDataToExcelMonth function which exports averages group by month 
            $scope.exportDataToExcelStyleMonth = {
                sheetid: 'Avg and yield per month in ' + moment($scope.selectedDate).format("MMMM YYYY"),
                headers: true,
                caption: {
                    title: moment($scope.selectedDate).format("MMMM YYYY") + ' Monthly Yields - created on: ' + moment($scope.today).format("DD, MMMM YYYY HH:mm")
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
                    },
                    {
                        columnid: 'yieldValue',
                        title: 'Yield',
                        width: 100
                    }
                ]

            };

            //Export the data from the month's average vs optimum levels table
            $scope.exportAllDataToExcelMonth = function () {
                var i, allDataToExport = [], yieldValue,
                    object = {};
                plants = angular.copy($scope.plantations);

                for (i = 0; i < plants.length; i++) {
                    object = {};

                    if(plants[i].monthlySummary.length !== 0){
                        yieldValue = plants[i].monthlySummary[0].yieldValue;
                    } else {
                        yieldValue = undefined;
                    } 
                    
                    object = {
                        plantationID: plants[i].plantationID,
                        plantName: plants[i].plantName,
                        date: moment($scope.selectedDate).format("MMMM YYYY"),
                        airTemp: plants[i].airTempReport.lastReading,
                        humidity: plants[i].humidityReport.lastReading,
                        lightIntensity: plants[i].lightIntensityReport.lastReading,
                        soilMoisture: plants[i].soilMoistureReport.lastReading,
                        yieldValue: yieldValue
                    };
                    allDataToExport.push(object);
                }

                alasql('SELECT * INTO XLS("Monthly Yields (in month).xls",?) FROM ?', [$scope.exportDataToExcelStyleMonth, allDataToExport]);
            };

            //console.log($scope.plantations);
        };
    }
});
