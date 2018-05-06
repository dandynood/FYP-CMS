/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').factory('plantationService', function ($http, $q) {
    "use strict";
    var plantations,
        allLevels,
        service;

    service = {
        //When dashboard parent state loads
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
                            plantations = angular.copy(response.data);
                            deferred.resolve(response.data);
                        }
                    });
            }

            return deferred.promise;
        },

        //is called when you go to a dashboard.plantation state
        getPlantation: function (id) {
            var deferred = $q.defer(),
                copy,
                i,
                str = {
                    plantationID: encodeURIComponent(id)
                };

            //This should work given how getAllLevels got all plantation conditions from loading
            //the dashboard parent state
            if (angular.isDefined(allLevels)) {
                for (i = 0; i < allLevels.length; i++) {
                    if (allLevels[i].plantationID === id) {
                        copy = angular.copy(allLevels[i]);
                        deferred.resolve(copy);
                        break;
                    }
                }
                //as a safety precaution, just get the plantation details and not conditions
                //should display some error on the plantation page how data is not available
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
        
        //gets all condition levels for each plantation after loading the plantation binding in main\
        //when loading the dashboard parent state
        getAllLevels: function (plants) {
            var deferred = $q.defer(),
                plantsArray = angular.copy(plants),
                i, j, arrayLevels = [];

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

                        for (i = 0; i < plantsArray.length; i++) {
                            plantsArray[i].conditionLevels = [];
                            for (j = 0; j < arrayLevels.length; j++) {
                                if (arrayLevels[j].plantationID === plantsArray[i].plantationID) {
                                    delete arrayLevels[j].plantationID;
                                    plantsArray[i].conditionLevels.push(arrayLevels[j]);
                                }
                            }
                        }

                        allLevels = angular.copy(plantsArray);

                        deferred.resolve(plantsArray);
                    }
                });

            return deferred.promise;
        }

    };

    return service;
});
