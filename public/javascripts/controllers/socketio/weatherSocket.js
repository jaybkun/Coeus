(function() {
    'use strict';

    /**
     *
     */
    angular.module('WeatherControllerModule', []).
        controller('WeatherController', ['$scope', 'SocketFactory', function ($scope, SocketFactory) {

            var socket = SocketFactory.createSocket('/api/weather');

            $scope.commLog = [];


            socket.on('message', function (data) {
                $scope.commLog.push(data);
                $scope.message = data;
                $scope.$apply();
            });

            socket.on('weatherUpdate', function (data) {
                $scope.commLog.push(data);
                $scope.weather = data;
                $scope.$apply();
            });

            $scope.updatesEnabled = false;
            $scope.toggleWeatherUpdates = function () {
                if ($scope.updatesEnabled) {
                    socket.emit('weatherUpdate:stop', {});
                    $scope.commLog.push("updateWeather:stop");
                    fadeMessage('updateWeather:stop');
                } else {
                    socket.emit('weatherUpdate:start', {'zip': 21017});
                    $scope.commLog.push('updateWeather:start');
                    fadeMessage('updateWeather:start');
                }
                $scope.updatesEnabled = !$scope.updatesEnabled;
            };

            var fadeMessage = function(message) {
                $scope.lastMessage = message;
                $('#lastMessage').stop();
                $('#lastMessage').fadeTo(0, 1);
                $('#lastMessage').fadeOut(5000, 'linear');
            };




        }]);
})();
