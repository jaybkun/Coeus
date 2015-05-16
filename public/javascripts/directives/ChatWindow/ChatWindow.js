;(function() {
    'use strict';

    angular.module('ChatWindowModule', []).
        directive('chatWindow', function() {
            return {
                restrict: 'E',
                templateUrl: '/javascripts/directives/ChatWindow/ChatWindow.html',
                controller: ['$scope', 'SocketFactory', function($scope, SocketFactory) {

                    var chatSocket = SocketFactory.createSocket('/api/chat');

                    $scope.message = "";
                    $scope.messageLog = [];

                    chatSocket.on('new message', function(data) {
                        $scope.messageLog.push(data);
                        $scope.$apply();
                    });

                    $scope.sendMessage = function() {
                        chatSocket.emit('new message', $scope.message);
                        $scope.message = "";
                    };

                }]
            };
        });
})();
