(function() {
    'use strict';

    var app = angular.module('coeus', [
        'ui.router',
        'mm.foundation',
        'ngResource',
        'luegg.directives',
        'CoeusControllers',
        'CoeusServices',
        'CoeusDirectives'
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
            state('rt', {
                url: '/socket.io',
                template: '<div class="row"><div ui-view class="small-12 columns">Socket.io Examples</div></div>'
            }).
            state('rt.weather', {
                url: '/weather',
                templateUrl: '/views/rt/weather.html'
            }).
            state('rt.chat', {
                url: '/chat',
                templateUrl: '/views/rt/chat.html'
            }).
            state('3d', {
                url: '/3d',
                templateUrl: '/views/3d/3d.html',
                controller: '3dController'
            });
    });

    app.controller('CoeusMainController', ['$scope', '$resource', function($scope, $resource) {
        $scope.git = $resource('/api/version').get();
    }]);

})();
