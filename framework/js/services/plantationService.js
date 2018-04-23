/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').factory('plantationService', function ($http, $q) {
    "use strict";
    var plantations,
        allLevels,
        plantationLevel,
        service;

    service = {
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
                            plantations = response.data;
                            deferred.resolve(response.data);
                        }
                    });
            }

            return deferred.promise;
        },

        getPlantationLevels: function (id) {
            var deferred = $q.defer(),
                str = {
                    plantationID: encodeURIComponent(id)
                };

            if (angular.isDefined(plantationLevel) && plantationLevel.plantationID === id) {
                deferred.resolve(plantationLevel);
            } else {

                $http({
                        method: 'POST',
                        url: 'php/getConditionLevels.php',
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

        getPlantation: function (id) {
            var deferred = $q.defer(),
                i,
                str = {
                    plantationID: encodeURIComponent(id)
                };

            if (angular.isDefined(plantations)) {
                for (i = 0; i < plantations.length; i++) {
                    if (plantations[i].plantationID === id) {
                        deferred.resolve(plantations[i]);
                        break;
                    }
                }
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

        getAllLevels: function (plants) {
            var deferred = $q.defer(),
                i, j, arrayLevels = [];

            if (angular.isDefined(allLevels)) {
                deferred.resolve(allLevels);
            } else {

                $http({
                        method: 'POST',
                        url: 'php/getAllConditionLevels.php',
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
                                plants[i].conditionLevels = [];
                                for (j = 0; j < arrayLevels.length; j++) {
                                    if (arrayLevels[j].plantationID === plants[i].plantationID) {
                                        delete arrayLevels[j].plantationID;
                                        plants[i].conditionLevels.push(arrayLevels[j]);
                                    }
                                }
                            }

                            deferred.resolve(plants);
                        }
                    });
            }

            return deferred.promise;
        }

    };

    return service;
});
