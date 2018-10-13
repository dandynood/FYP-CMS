/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').factory('notificationService', function ($http, $sessionStorage) {
    "use strict";
    var opertionalAlerts = [],
        service = {
            getRecentNavNotifications: function () {
                var user = $sessionStorage.user,
                    str = {
                        userID: encodeURIComponent(user.userID)
                    };

                return $http({
                        method: 'POST',
                        url: 'php/getRecentNotfForUsers.php',
                        data: str,
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(function (response) {
                        if (response.data === "failed") {
                            return undefined;
                        } else {
                            return response.data;
                        }
                    });
            },

            getAllNotifications: function () {
                return $http({
                        method: 'POST',
                        url: 'php/getAllNotfForUser.php',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(function (response) {
                        if (response.data === "failed") {
                            var errMsg = "failed";
                            return errMsg;
                        } else {
                            return response.data;
                        }
                    });
            },

            deleteRecentNotfForUser: function () {
                var user = $sessionStorage.user,
                    str = {
                        userID: encodeURIComponent(user.userID)
                    };

                return $http({
                        method: 'POST',
                        url: 'php/deleteRecentNotfForUser.php',
                        data: str,
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(function (response) {
                        if (response.data === "failed") {
                            var errMsg = "failed";
                            return errMsg;
                        } else {
                            return response.data;
                        }
                    });
            },

            organizeOperationalAlerts: function (plantID, plantName, tempReport, humidityReport, LIReport, SMReport) {
                var alert = {};
                alert.plantID = plantID;
                alert.plantName = plantName;
                
                if(tempReport && tempReport.status !== "Normal"){
                    alert.tempStatus = tempReport.status;
                    alert.tempReading = tempReport.lastReading;
                }
                if(humidityReport && humidityReport.status !== "Normal"){
                    alert.humidityStatus = humidityReport.status;
                    alert.humidityReading = humidityReport.lastReading;
                }
                if(LIReport && LIReport.status !== "Normal"){
                    alert.LIStatus = LIReport.status;
                    alert.LIReading = LIReport.lastReading;
                }
                if(SMReport && SMReport.status !== "Normal"){
                    alert.SMStatus = SMReport.status;
                    alert.SMReading = SMReport.lastReading;
                }
                
                opertionalAlerts.push(alert);
            },
            
            getOperationalAlerts: function(){
                return opertionalAlerts;
            },
            
            resetOperationalAlerts: function(){
                opertionalAlerts = [];
            }
        };

    return service;
});
