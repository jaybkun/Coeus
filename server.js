var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var http = require('http');

var routes = require('./routes/index');
var weather = require('./routes/weather');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-compass')({mode: 'expanded'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/weather', weather);
app.use('/api/*', routes);
app.use('/api', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function() {
    console.log("Listening on " + server_ip_address + ", server_port " + server_port);
});

io.sockets.on('connection', function(socket) {
    socket.emit('message', {message: "the weather channel"});

    socket.on('weatherUpdate:start', function(socket) {
        startWeatherUpdates(socket);
    });

    socket.on('updateWeather:stop', function(socket) {
        stopWeatherUpdates()
    });

    var updateTimer;
    function startWeatherUpdates() {
        if (updateTimer) return;
        updateWeather();
    }

    function stopWeatherUpdates() {
        clearInterval(updateTimer);
        updateTimer = null;
    }

    function updateWeather() {

        var options = {
            host: 'api.openweathermap.org',
            port: 80,
            method: 'GET',
            path: '/data/2.5/weather?zip=21017,us'
        };

        var req = http.request(options, function(res) {
            var weatherData = "";
            res.on('data', function(chunk) {
                weatherData += chunk;
            });
            res.on('end', function(end) {
                try {
                    var weatherJSON = JSON.parse(weatherData);
                    weatherJSON.timestamp = new Date();

                    io.sockets.emit("weatherUpdate", weatherJSON);
                } catch (err) {
                    console.error("ERROR:" + err);
                }
            });
            updateTimer = setTimeout(updateWeather, 1000);
        }).on('error', function(error) {
            console.error("ERROR: " + error.message);
        });
        req.end();
    }



});

