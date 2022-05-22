const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(file, 'utf-8');
const {stdout} = process;
let data = '';

stream.on('data', ch => data += ch);
stream.on('end', () => stdout.write(data));
stream.on('error', error => console.error(error.message));