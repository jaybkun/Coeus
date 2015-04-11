/**
 * Created by Jay on 4/11/2015.
 */
(function() {
    'use strict';

    var app = angular.module('SocketsFactory', []);

    /**
     * Creates Sockets for socket.io application
     */
    app.factory('SocketFactory', function() {
        var connections = [
            'http://localhost:8080',
            'http://coeus-draktheri.rhcloud.com:8000'];

        return {
            createSocket: function() {
                var socket;
                try {
                    angular.forEach(connections, function(connection) {
                        if (!socket) {
                            socket = io.connect(connection);
                        }
                    });

                } catch (err) {
                    console.err(err);
                }

                return socket;
            }
        }
    });

})();
