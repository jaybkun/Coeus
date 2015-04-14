'use strict';

angular.module('weatherController', []).
    controller('weatherController', ['$scope', 'SocketFactory', function ($scope, SocketFactory) {

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
            } else {
                socket.emit('weatherUpdate:start', {'zip': 21017});
                $scope.commLog.push("updateWeather:start");
            }
            $scope.updatesEnabled = !$scope.updatesEnabled;
        };
    }]);