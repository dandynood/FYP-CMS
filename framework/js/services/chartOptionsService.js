/*jslint white:true */
/*global angular */
/*jslint plusplus:true*/
angular.module('mainApp').factory('chartOptionsService', function () {
    "use strict";
    var chartConfig = [{
                name: 'tempHumidity',
                seriesLabel: ['Air Temperature (C)', 'Humidity (%)'],
                datasetOverride: [{
                    yAxisID: 'air-temp-axis',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBorderWidth: 2,
                    pointBorderColor: '#FFFFFF'
                }, {
                    yAxisID: 'humidity-axis',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBorderWidth: 2,
                    pointBorderColor: '#FFFFFF'
                }],
                color: ['#ff6384', '#45b7cd'],
                options: {
                    scales: {
                        yAxes: [
                            {
                                id: 'air-temp-axis',
                                type: 'linear',
                                display: true,
                                position: 'left',
                                ticks: {
                                    min: 0,
                                    max: 60
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Temperature (C)'
                                }
                            },
                            {
                                id: 'humidity-axis',
                                type: 'linear',
                                display: true,
                                position: 'right',
                                ticks: {
                                    min: 0,
                                    max: 100
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Humidity (%)'
                                }
                        }],
                        xAxes: [{
                            type: 'time',
                            distribution: 'linear',
                            time: {
                                displayFormats: {
                                    hour: 'hA',
                                    week: 'll'
                                }
                            }
                        }]
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontSize: 15,
                            padding: 25
                        }
                    },
                    plugins: {
                        deferred: {
                            xOffset: 150, // defer until 150px of the canvas width are inside the viewport
                            yOffset: '35%', // defer until 50% of the canvas height are inside the viewport
                            delay: 250 // delay of 250 ms after the canvas is considered inside the viewport
                        }
                    },
                    responsiveAnimationDuration: 1000,
                    layout: {
                        padding: {
                            top: -10
                        }
                    }
                }
            },
            {
                name: 'airTemp',
                seriesLabel: ['Air Temperature (C)']
            },
            {
                name: 'humidity',
                seriesLabel: ['Air Temperature (C)']
            },
            {
                name: 'lightIntensity',
                seriesLabel: ['Light Intensity (Lux)'],
                datasetOverride: [{
                    yAxisID: 'light-intensity-axis',
                    borderWidth: 2
                }],
                color: ['#FDB45C'],
                options: {
                    scales: {
                        yAxes: [
                            {
                                id: 'light-intensity-axis',
                                type: 'linear',
                                display: true,
                                position: 'left',
                                ticks: {
                                    min: 0,
                                    max: 60000
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Light Intensity (Lux)'
                                }
                            }],
                        xAxes: [{
                            type: 'time',
                            distribution: 'linear',
                            time: {
                                displayFormats: {
                                    hour: 'hA',
                                    week: 'll'
                                }
                            }
                        }]
                    },
                    plugins: {
                        deferred: {
                            xOffset: 150, // defer until 150px of the canvas width are inside the viewport
                            yOffset: '35%', // defer until 50% of the canvas height are inside the viewport
                            delay: 250 // delay of 250 ms after the canvas is considered inside the viewport
                        }
                    },
                    responsiveAnimationDuration: 1000
                }
            },
            {
                name: 'soilMoisture',
                seriesLabel: ['Soil Moisture (%)'],
                datasetOverride: [{
                    yAxisID: 'soil-moisture-axis',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBorderWidth: 2,
                    pointBorderColor: '#FFFFFF'
                }],
                color: ['#4C4CA6'],
                options: {
                    scales: {
                        yAxes: [
                            {
                                id: 'soil-moisture-axis',
                                type: 'linear',
                                display: true,
                                position: 'left',
                                ticks: {
                                    min: 0,
                                    max: 100
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Soil Moisture (%)'
                                }
                            }],
                        xAxes: [{
                            type: 'time',
                            distribution: 'linear',
                            time: {
                                displayFormats: {
                                    hour: 'hA',
                                    week: 'll'
                                }
                            }
                        }]
                    },
                    plugins: {
                        deferred: {
                            xOffset: 150, // defer until 150px of the canvas width are inside the viewport
                            yOffset: '35%', // defer until 50% of the canvas height are inside the viewport
                            delay: 250 // delay of 250 ms after the canvas is considered inside the viewport
                        }
                    },
                    responsiveAnimationDuration: 1000
                }
            },
            {
                name: 'optimumLevels',
                seriesLabel: ['Min', 'Optimum', 'Last Recorded'],
                labels: ["Optimum Range", "Last Recording"],
                options: {
                    scales: {
                        xAxes: [{
                            stacked: false,
                            ticks: {
                                min: 0
                            },
                            scaleLabel: {
                                display: true,
                                labelString: ''
                            }

                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    },
                    legend: {
                        display: true,
                        labels: {
                            fontSize: 15,
                            padding: 25
                        }
                    },
                    responsiveAnimationDuration: 1000,
                    layout: {
                        padding: {
                            top: -10
                        }
                    },
                    tooltips: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var tooltip = data.datasets[tooltipItem.datasetIndex],
                                    value = tooltip.data[tooltipItem.index];
                                return value === 0 ? null : tooltip.label === 'Optimum' ? tooltip.label + ': <' + value : tooltip.label + ': ' + value;
                            }
                        }
                    }
                }
            }
        ],

        service = {
            findName: function (name) {
                return chartConfig.find(function (x) {
                    return x.name === name;
                });
            },

            getSeriesLabel: function (name) {
                var data = [];
                data = this.findName(name);

                if (data) {
                    return data.seriesLabel;
                } else {
                    return data;
                }
            },

            getDatasetOverride: function (name) {
                var data = [];
                data = this.findName(name);

                if (data) {
                    return data.datasetOverride;
                } else {
                    return data;
                }
            },

            getColor: function (name) {
                var data = [];
                data = this.findName(name);

                if (data) {
                    return data.color;
                } else {
                    return data;
                }
            },

            getOptions: function (name) {
                var data = [];
                data = this.findName(name);

                if (data) {
                    return data.options;
                } else {
                    return data;
                }
            },

            getOptimumSettings: function (name) {
                var data = [];
                data = this.findName(name);

                if (data) {
                    return data;
                }
            }
        };

    return service;

});
