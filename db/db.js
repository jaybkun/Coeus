(function() {
    'use strict';

    var mongoose = require('mongoose');
    var bluebird = require('bluebird');
    bluebird.promisifyAll(mongoose);

    mongoose.connect('mongodb://localhost/coeus');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {

    });

})();