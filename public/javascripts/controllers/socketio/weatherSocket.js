(function() {
    'use strict';

    var app = angular.module('weatherSocket', ['ngResource']);

})();
app.controller('weatherController', ['$scope', '$resource', 'SocketFactory', function($scope, $resource, SocketFactory) {

    var socket = SocketFactory.createSocket();

    socket.on('weatherUpdate', function (data) {
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


