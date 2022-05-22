const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'files');
const directoryCopy = path.join(__dirname, 'copyDirectory/');

fs.rmdir(directoryCopy, () => {});
fs.mkdir(directoryCopy, () => {});
fs.readdir(directory, (error, data) => {
  if (error) return console.error(error.message);

  data.forEach(v => {
      
    let fileDirectory = path.join(directory, v);
    let fileCopyDir = path.join(directoryCopy, v);
    fs.copyFile(fileDirectory, fileCopyDir, () => {});

  });
});