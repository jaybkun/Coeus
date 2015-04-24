'use strict';

var app = angular.module('coeus', [
    'ui.router',
    'mm.foundation',
    'ngResource',
    'CoeusControllers',
    'CoeusServices'
]);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/views/home/home.html'
        }).
        state('clustering', {
            url: '/clustering',
            templateUrl: '/views/clustering/clustering.html'
        }).
        state("socketio", {
            url: '/socket.io',
            templateUrl: '/views/socket.io/socket.io.html',
            controller: 'weatherController'
        }).
        state("socketio.chat", {
            url: '/chat',
            templateUrl: '/views/chat/chat.html',
            controller: 'chatController'
        }).
        state("3d", {
            url: '/3d',
            templateUrl: '/views/3d/3d.html',
            controller: '3dController'
        });
});

app.controller('coeusMainController', ['$rootScope', '$scope', '$resource', function($rootScope, $scope, $resource) {
    $rootScope.git = $resource('/api/version').get();
}]);