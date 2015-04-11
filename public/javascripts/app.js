'use strict';

var app = angular.module('coeus', [
    'ui.router',
    'weatherSocket',
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
            templateUrl: '/views/socket.io/socket.io.html'
        });
});