'use strict';

var chatSockets = function(io) {
    var chat = io.
        of('/api/chat').
        on('connection', function (socket) {
            socket.on('new message', function(data) {
                socket.emit('new message', data);
            });
        });
};

module.exports = chatSockets;
