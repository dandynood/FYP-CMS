/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').service('plantationService', function ($http, $q) {
    "use strict";
    var plantations,
        conditionLevels,
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

            if (angular.isDefined(conditionLevels)) {
                deferred.resolve(conditionLevels);

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
                            plantations = response.data;
                            deferred.resolve(response.data);
                        }
                    });
            }

            return deferred.promise;
        },

        getAllLevels: function (plantations) {
            var i, arrayLevels = [];

            if(plantations){
                for (i = 0; i < plantations.length; i++) {
                    arrayLevels.push(this.getPlantationLevels(plantations[i].plantationID));
                }
            }
            
            return arrayLevels;
        }

    };

    return service;
});
