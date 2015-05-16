;(function() {
    'use strict';

    angular.module('WeatherControllerModule', []).
        controller('WeatherController', ['$scope', 'SocketFactory', function ($scope, SocketFactory) {

            var socket = SocketFactory.createSocket('/api/weather');

            $scope.commLog = [];
            $scope.zip = 21017;

            socket.on('message', function (data) {
                $scope.commLog.push(data);
                $scope.message = data;
                $scope.$apply();
            });

            socket.on('weatherUpdate', function (data) {
                $scope.commLog.push(data);
                $scope.weather = data;
                $scope.$apply();

                startCountdown();
            });

            $scope.updatesEnabled = false;
            $scope.toggleWeatherUpdates = function () {
                if ($scope.updatesEnabled) {
                    socket.emit('weatherUpdate:stop', {});
                    $scope.commLog.push("updateWeather:stop");
                    fadeMessage('updateWeather:stop');
                } else {
                    socket.emit('weatherUpdate:start', {'zip': $scope.zip});
                    $scope.commLog.push('updateWeather:start');
                    fadeMessage('updateWeather:start');
                }
                $scope.updatesEnabled = !$scope.updatesEnabled;
            };

            var fadeMessage = function(message) {
                $scope.lastMessage = message;

                var lastMessage = $('#lastMessage');
                lastMessage.stop();
                lastMessage.fadeTo(0, 1);
                lastMessage.fadeOut(5000, 'linear');
            };

            $scope.updateCountdown = 0;
            var updateTimer = null;
            var updateCountdownTimer = function() {
                if (!$scope.updatesEnabled) {
                    return;
                }
                $scope.updateCountdown -= 1;
                $scope.$apply();
                updateTimer = setTimeout(updateCountdownTimer, 1000);
            };

            var startCountdown = function() {
                clearTimeout(updateTimer);
                updateTimer = null;
                $scope.updateCountdown = 60;
                $scope.$apply();
                updateCountdownTimer();
            };

        }]);
})();
