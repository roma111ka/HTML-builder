const fs = require('fs');
const path = require('path');
const {stdout} = process;
const fileP = path.join(__dirname, 'secret-folder');

fs.readdir(fileP, {withFileTypes: true}, (error, files) => {

  if (error) return console.error(error.message);

  files.filter(file => file.isFile()).forEach(file => fs.stat(path.join(fileP, file.name), (error, stats) => {

    if (error) return console.error(error.message);

    const fileExt = path.extname(path.join(fileP, file.name));

    stdout.write(`${path.basename(path.join(fileP, file.name), fileExt)} - ${fileExt.replace('.', '')} - ${(stats.size / 1024).toFixed(3)} kb\n`);
    
  }));
});