(function() {
    'use strict';

    module.exports = function(io) {
        var chatUsers = {};

        var chat = io.
            of('/api/chat').
            on('connection', function (socket) {

                var userRegistered = false;

                socket.on('new user', function(username) {
                    socket.username = username;
                    userRegistered = true;
                    chatUsers[username] = username;

                    chat.emit('user joined', {username: username});
                });

                socket.on('new message', function(data) {
                    chat.emit('new message', data);
                });

                socket.on('disconnect', function() {
                    if (userRegistered) {
                        delete chatUsers[socket.username];
                        chat.emit('user left', {username:socket.username});
                    }
                });
            });
    };

})();
