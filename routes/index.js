'use strict';

var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

router.get('/api/version', function(req, res) {
    exec('git log -1 --format="{hash : %H,,,date : %cd}"', function(err, stdout, stderr) {
        var gitInfo = stdout.split(",,,");
        var obj = {
            'hash' : gitInfo[0].split(":")[1],
            'date' : gitInfo[1].split(":")[1]
        };
        res.json(obj);
    });
});

module.exports = router;
