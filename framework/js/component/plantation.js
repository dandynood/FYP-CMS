/*jslint white:true */
/*global angular */
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

                $scope.plant.soilMoistureReport = optimumLevelsService.compareHumidity(last.soilMoisture, $scope.plant.optimumLevels.soilMoisture);
            }
        
        };

    }

});
