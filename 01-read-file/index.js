const path = require('path');
const fs = require('fs');
const { stdout } = process;

let read = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

read.on('data', (chunk) => stdout.write(chunk));
