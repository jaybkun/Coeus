(function() {
    'use strict';

    var app = angular.module('socket.io', ['ngResource']);

    app.controller('weatherController', ['$scope', '$resource', function($scope, $resource) {

        // Establish connection
        var socket = io.connect('http://localhost:8080');

        socket.on('weatherUpdate', function(data) {
            $scope.weather = data;
            $scope.$apply();
        });

        $scope.updatesEnabled = false;
        $scope.toggleWeatherUpdates  = function() {
            if ($scope.updatesEnabled) {
                socket.emit('weatherUpdate:stop', {});
            } else {
                socket.emit('weatherUpdate:start', {});
            }
            $scope.updatesEnabled = !$scope.updatesEnabled;
        };


    }]);
})();


