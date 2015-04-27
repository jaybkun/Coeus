(function() {
    'use strict';

    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    var bluebird = require('bluebird');
    bluebird.promisifyAll(mongoose);
    var http = require('http');

    var routes = require('./routes/index.js');

    var app = express();

    app.use('/', routes);

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // catch 404 and forward to error handler
    app.use(function (req, res, next ) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(routes);

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktrace leaked to user
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    module.exports = app;

    var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    require('./routes/chat')(io);
    require('./routes/weather')(io);

    io.on('connection', function(socket) {
        console.log('new connection');
        socket.emit('new message', {'message' : 'hi'});
    });

    server.listen(server_port, server_ip_address, function() {
        console.log("Listening on " + server_ip_address + ", server_port " + server_port);
    });



})();
