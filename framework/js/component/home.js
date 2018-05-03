/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('home', {
    templateUrl: 'template/home.html',
    bindings: {
        allConditionLevels: '<',
        optimumLevels: '<'
    },

    //Controller for home page
    controller: function ($scope, chartOptionsService, optimumLevelsService) {
        "use strict";

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

        //Below methods are used to extract individual conditions for display on graphs
        //from the allConditionLevels binding that has all the conditions for each plantation
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
                time.x = conditions[i].dateTime;
                time.y = conditions[i].lightIntensity;
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
                time.x = conditions[i].dateTime;
                time.y = conditions[i].soilMoisture;
                moisture.push(time);
            }

            if (moisture.length === 0) {
                data = [];
            } else {
                data.push(moisture);
            }
            return data;

        };

        //This $onInit code is needed to access the bindings,
        //This will also run when loading the state so that it extracts the conditions 
        //and graph them appropriately.
        this.$onInit = function () {
            var i, j, lastPosition, last,
                plants = this.allConditionLevels,
                optimumLevels = this.optimumLevels;

            $scope.plantations = angular.copy(plants);

            //Here we copy the conditions into $scope
            //Then we simply add new attributes in each plantation object in the array
            //these attributes are the conditions that are seperated from conditionLevels
            //using the methods above to extract them
            for (i = 0; i < $scope.plantations.length; i++) {

                $scope.plantations[i].airTempandHumidity = $scope.extractAirTempAndHumidity($scope.plantations[i].conditionLevels);

                $scope.plantations[i].lightIntensity = $scope.extractLightIntensity($scope.plantations[i].conditionLevels);

                $scope.plantations[i].soilMoisture = $scope.extractSoilMoisture($scope.plantations[i].conditionLevels);

            }

            //then we retrieve the optimum levels, from the binding, via ID lookup
            //compare between $scope.plantations and optimumlevels
            for (i = 0; i < $scope.plantations.length; i++) {
                $scope.plantations[i].optimumLevels = {};
                for (j = 0; j < optimumLevels.length; j++) {
                    if (optimumLevels[j].plantationID === $scope.plantations[i].plantationID) {
                        $scope.plantations[i].optimumLevels = optimumLevels[j].optimumLevels;
                        break;
                    }
                }
            }

            for (i = 0; i < $scope.plantations.length; i++) {
                
                if ($scope.plantations[i].conditionLevels.length > 0) {
                    lastPosition = $scope.plantations[i].conditionLevels.length - 1;
                }
                
                last = $scope.plantations[i].conditionLevels[lastPosition];

                if (last) {
                    $scope.plantations[i].airTempReport = optimumLevelsService.compareAirTemp(last.airTemp, $scope.plantations[i].optimumLevels.airTemp);
                    
                    $scope.plantations[i].humidityReport = optimumLevelsService.compareHumidity(last.humidity, $scope.plantations[i].optimumLevels.humidity);
                    
                    $scope.plantations[i].soilMoistureReport = optimumLevelsService.compareHumidity(last.soilMoisture, $scope.plantations[i].optimumLevels.soilMoisture);
                }
            }

            console.log($scope.plantations);
        };

    }

});
