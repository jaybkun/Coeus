'use strict';

var app = angular.module('coeus', ['ui.router']);

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
        });
});