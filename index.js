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

let GoogleHomeNotifierCLI = require('./lib/google-home-notifier-cli');
let ghncli = new GoogleHomeNotifierCLI(fd);
ghncli.run();
