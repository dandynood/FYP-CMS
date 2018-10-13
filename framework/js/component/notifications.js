/*jslint white:true */
/*global angular */
/*global moment */
/*jslint plusplus:true*/
angular.module('mainApp').component('notifications', {
    templateUrl: 'template/notifications.html',
    bindings: {
        allNotifications: '<'
    },

    //Controller for login
    controller: function ($scope) {
        "use strict";

        this.$onInit = function () {
            //This gets the date for today
            //SelectedDate will change, $scope.today is for reference of today
            //This is in case you pick the today date on the datepicker to get back the last recording data
            $scope.selectedDate = undefined;
            $scope.today = new Date();
            $scope.allNotf = angular.copy(this.allNotifications);
            $scope.testing = "Has editing some plantation details <p><ol><li>hello</li><li>Hello again</li></ol></p>";

            $scope.organizeMsgs = function () {
                var i = 0;
                for (i = 0; i < $scope.allNotf.msgs.length; i++) {
                    $scope.allNotf.msgs[i].dateTime = new Date($scope.allNotf.msgs[i].dateTime);
                }
            };

            $scope.organizeMsgs();

            $scope.datePicker = {
                opened: false,
                format: 'dd MMMM yyyy',
                dateOptions: {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    dateDisabled: function (data) {
                        var date = data.date,
                            mode = data.mode,
                            i, isRealDate = true;
                        for (i = 0; i < $scope.allNotf.dates.length; i++) {
                            if ($scope.allNotf.dates[i].date === moment(date).format("YYYY-MM-DD")) {
                                isRealDate = false;
                            }
                        }
                        return (mode === 'day' && isRealDate);
                    }
                }
            };

            $scope.openDatePicker = function () {
                $scope.datePicker.opened = true;
            };

            $scope.getDateNotf = function (selectedDate) {
                $scope.filterDate = moment(selectedDate).format("YYYY-MM-DD");
            };

            $scope.clearDatePicker = function () {
                $scope.selectedDate = undefined;
                $scope.filterDate = "";
            };

            $scope.numberOfElements = 5;
            $scope.currentPage = 0;

            $scope.pageCount = function () {
                var countmsgs = 0;
                countmsgs += $scope.allNotf.msgs.length;
                return Math.ceil(countmsgs / $scope.numberOfElements) - 1;
            };
            
            $scope.range = function () {
                var rangeSize = 10,
                    numOfPaginationButtons = [],
                    start = $scope.currentPage,
                    i;
                if (rangeSize > $scope.pageCount()) {
                    rangeSize = $scope.pageCount() + 1;
                }

                if (start > $scope.pageCount() - rangeSize) {
                    start = $scope.pageCount() - rangeSize + 1;
                }

                for (i = start; i < start + rangeSize; i++) {
                    numOfPaginationButtons.push(i);
                }

                return numOfPaginationButtons;
            };

            $scope.setPage = function (num) {
                $scope.currentPage = num;
            };

            $scope.previousPage = function () {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                }
            };

            $scope.previousPageDisabled = function () {
                return $scope.currentPage === 0 ? "disabled" : "";
            };

            $scope.nextPage = function () {
                if ($scope.currentPage < $scope.pageCount()) {
                    $scope.currentPage++;
                }
            };

            $scope.nextPageDisabled = function () {
                return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
            };

            $scope.checkLimit = function (index) {
                if (index > 0) {
                    return $scope.allNotf[index - 1].msgs.length - $scope.numberOfElements;
                } else {
                    return $scope.numberOfElements;
                }
            };
        };
    }

}).filter("offset", function () {
    "use strict";
    return function (input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});
