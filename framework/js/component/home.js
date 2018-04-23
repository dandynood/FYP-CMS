/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').component('home', {
    templateUrl: 'template/home.html',
    bindings: {
        allConditionLevels: '<'
    },

    //Controller for home page
    controller: function ($scope, chartOptionsService) {
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
            
            if(airTemp.length === 0 && humidity.length === 0){
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

            if(light.length === 0){
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

            if(moisture.length === 0){
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
            var i,
                plants = this.allConditionLevels;

            $scope.plantationConditions = [];
            $scope.lightIntensity = [];
            $scope.soilMoisture = [];
            $scope.plantation = {};

            //Extract and store in each $scope variable arrays above
            //After getting all conditions for each unit, put them in the plantation object
            //push object then into the plantationConditions array of objects
            for (i = 0; i < plants.length; i++) {
                $scope.plantation = {};
                $scope.plantation.plantationID = plants[i].plantationID;

                $scope.plantation.airTempandHumidity = $scope.extractAirTempAndHumidity(plants[i].conditionLevels);

                $scope.plantation.lightIntensity = $scope.extractLightIntensity(plants[i].conditionLevels);

                $scope.plantation.soilMoisture = $scope.extractSoilMoisture(plants[i].conditionLevels);

                $scope.plantationConditions.push($scope.plantation);
            }

            //These getters get the conditions
            //from the plantationConditions previously assigned above
            $scope.getAirTempAndHumidity = function (id) {
                var data = $scope.plantationConditions.find(function (x) {
                    return x.plantationID === id;
                });

                return data.airTempandHumidity;
            };

            $scope.getLightIntensity = function (id) {
                var data = $scope.plantationConditions.find(function (x) {
                    return x.plantationID === id;
                });
                return data.lightIntensity;
            };

            $scope.getSoilMoisture = function (id) {
                var data = $scope.plantationConditions.find(function (x) {
                    return x.plantationID === id;
                });
                return data.soilMoisture;
            };


        };

    }

});