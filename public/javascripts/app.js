'use strict';

var app = angular.module('coeus', [
    'ui.router',
    'mm.foundation',
    'weatherController',
    '3d',
    'coeus_services'
]);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/views/home/home.html'
        })
        .state('clustering', {
            url: '/clustering',
            templateUrl: '/views/clustering/clustering.html'
        })
        .state("socketio", {
            url: '/socket.io',
            templateUrl: '/views/socket.io/socket.io.html',
            controller: 'weatherController'
        })
        .state("3d", {
            url: '/3d',
            templateUrl: '/views/3d/3d.html',
            controller: '3dController'
        });
});
