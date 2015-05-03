(function() {
    'use strict';

    var http = require('http');
    module.exports = function(io) {
        var weather = io.
            of('/api/weather').
            on('connection', function (socket) {

                var updateTimer;
                var zip = 21017;
                socket.on('weatherUpdate:start', function(params) {
                    if (updateTimer) {
                        return;
                    }
                    zip = params.zip;
                    getWeather(zip);
                    updateTimer = setInterval(function() { getWeather(zip); }, 60000); // Once a minute ask for updates
                });

                socket.on('weatherUpdate:stop', function() {
                    clearInterval(updateTimer);
                    updateTimer = null;
                });

                function getWeather(zip) {
                    var options = {
                        host: 'api.openweathermap.org',
                        port: 80,
                        method: 'GET',
                        path: '/data/2.5/weather?zip=' + zip + ',us'
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

                                socket.emit('weatherUpdate', weatherJSON);
                            } catch (err) {
                                console.error("ERROR:" + err);
                            }
                        });
                    }).on('error', function(error) {
                        console.error("ERROR: " + error.message);
                    });
                    req.end();
                }
            });
    };
})();


