'use strict';

/**
 * Creates Sockets for socket.io communication
 */
angular.module('SocketsFactory', []).
    factory('SocketFactory', function () {
        var connections = [
            /*'http://coeus-draktheri.rhcloud.com:8000',*/
            'http://localhost:8080'];

        return {
            createSocket: function (dest) {
                var socket;
                try {
                    angular.forEach(connections, function (connection) {
                        if (!socket) {
                            socket = io.connect(connection + dest);
                        }
                    });
                } catch (err) {
                    console.err(err);
                }
                return socket;
            }
        };
    });
