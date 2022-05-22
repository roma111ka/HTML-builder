const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');

const {stdin, stdout} = process;
const outputStream = fs.createWriteStream(file);

stdout.write('Print something!\n(Enter \'exit\' or press Ctrl+C to exit):\n');

stdin.on('data', chunk => {
  if (chunk.toString().toLowerCase().trim() === 'exit') {
    process.exit();
  } else {
    outputStream.write(chunk);
  }
});
stdin.on('error', error => console.log('Error', error.message));
process.on('exit', () => stdout.write('OK'));
process.on('SIGINT', process.exit);