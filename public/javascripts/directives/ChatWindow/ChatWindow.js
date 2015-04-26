(function() {
    'use strict';

    /**
     *
     */
    angular.module('ChatWindowModule', []).
        directive('chatWindow', function() {
            return {
                restrict: 'E',
                templateUrl: '/javascripts/directives/ChatWindow/ChatWindow.html',
                link: function(scope, elem, attr) {

                },
                controller: ['$scope', 'SocketFactory', function($scope, SocketFactory) {

                    var chatSocket = SocketFactory.createSocket('/api/chat');

                    $scope.message = "";
                    $scope.messageLog = [];

                    chatSocket.on('new message', function(data) {
                        $scope.messageLog.push(data);
                    });

                    $scope.sendMessage = function() {
                        chatSocket.emit($scope.message);
                        $scope.message = "";
                    };

                }]
            };
        });
})();
