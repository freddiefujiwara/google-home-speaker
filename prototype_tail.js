#!/usr/bin/env node

var NginxParser = require('nginxparser');
var exec = require('child_process').exec;

var parser = new NginxParser('$remote_addr - $remote_user [$time_local] '
    + '"$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"');

parser.read(process.argv[2], {tail:true},function (row) {
    var command = row.request.split(/\s/)[1].split(/\//).map(function(element, index, array) { return decodeURIComponent(element); });
    exec(command.join(' '),function(err, stdout, stderr){ 
        console.log(command.join(' '));
        console.log(stdout);
    //    console.log(err);
    });
    console.log(command);

}, function (err) {
    if (err) throw err;
    console.log('Done!')
});
