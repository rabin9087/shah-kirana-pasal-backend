"use strict";
const fs = require('fs');
const exec = require('child_process').exec;
fs.writeFile('newfile.txt', 'sdfsdf', (err) => {
    console.log(err);
});
exec('ls', (err, stdout, stderr) => {
    if (err) {
        console.log("error:", err);
        return;
    }
    console.log(stdout.trim().split('\n').join(', '));
});
