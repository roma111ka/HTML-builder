const path = require('path');
const fs = require('fs');
const wStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');

const dirPath = path.join(__dirname, 'styles');

function readStream(stream) {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.on('data', (chunk) => data += chunk);
    stream.on('end', () => resolve(`${data}\n`));
    stream.on('error', (err) => reject(err));
  });
}
(async () => {
  const files = await fs.promises.readdir(dirPath, {withFileTypes: true});
  files.forEach(async (file) => {
    const filePath = path.join(dirPath, file.name);
    if (file.isFile() && (path.extname(filePath) === '.css')) {
      const stream = fs.createReadStream(filePath, 'utf-8');
      const fileData = await readStream(stream);
      wStream.write(fileData);
    }
  });
})();