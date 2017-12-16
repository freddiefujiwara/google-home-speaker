#!/usr/bin/env node

let fs = require('fs');
let program = require('commander');
let pkg = require('./package');
let fd = undefined;
let fileValue = undefined;

program
    .version(pkg.version)
    .description(pkg.description)
    .arguments('[file.chromeless]')
    .action(function(file){
        fileValue = file;
    });
program.parse(process.argv);

if((typeof fileValue) === 'string'){
    fd = fs.openSync(fileValue,'r');
}else{
    fd = process.stdin.fd;
}

let GoogleHomeSpeaker = require('./lib/google-home-speaker');
let ghncli = new GoogleHomeSpeaker(fd);
ghncli.run();
