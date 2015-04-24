'use strict';

angular.module('ChatControllerModule', []).
    controller('chatController', ['$scope', 'SocketFactory', function($scope, SocketFactory) {

        $scope.message = "";
        $scope.messageLog = [];

        var chatSocket = SocketFactory.createSocket('/api/chat');

        chatSocket.on('new message', function(data) {
            $scope.messageLog.push(data);
            $scope.$apply();
        });

        $scope.sendMessage = function() {
            chatSocket.emit('new message', {'message':$scope.message});
            $scope.message = "";
        };

    }]);