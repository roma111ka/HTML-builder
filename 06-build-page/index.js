const path = require('path');
const fs = require('fs').promises;
const { createWriteStream } = require('fs');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');
const stylesPath = path.join(__dirname, 'styles');

const distPath = path.join(__dirname, 'project-dist');
const indexDistPath = path.join(distPath, 'index.html');
const assetsDistPath = path.join(distPath, 'assets');
const bundleDistPath = path.join(distPath, 'style.css');


const buildPage = () => {
  fs.mkdir(distPath)
    .then(async () => {
      copyDir(assetsPath, assetsDistPath);
      mergeStyles(stylesPath, bundleDistPath);
      writeIndexHTML(templatePath, componentsPath, indexDistPath);
    })
    .catch(async () => {
      await fs.rm(distPath, { recursive: true });
      buildPage();
    });
};
async function writeIndexHTML() {
  const files = await fs.readdir(componentsPath);

  const components = [];
  for (let file of files) {
    const pathToFile = path.join(componentsPath, file);
    const parsedFile = path.parse(pathToFile);
    if (parsedFile.ext === '.html') {
      const readFile = await fs.readFile(pathToFile, 'utf8');
      components.push({ name: parsedFile.name, data: readFile });
    }
  }

  let templateFile = await fs.readFile(templatePath, { encoding: 'utf8' });
  for (let component of components) {
    templateFile = templateFile.split(`{{${component.name}}}`);
    if (templateFile.length > 1) {
      templateFile = templateFile.join(component.data);
    }
  }

  const stream = createWriteStream(indexDistPath, { encoding: 'utf8' });
  stream.write(templateFile);
  stream.close;
}
  
function mergeStyles(stylesPath, bundleDistPath) {
  fs.readdir(stylesPath)
    .then(async (files) => {
      const readFiles = [];
      for (let file of files) {
        const pathToFile = path.join(stylesPath, file);
        const extFile = path.parse(pathToFile).ext;
        if (extFile === '.css') {
          const readFile = await fs.readFile(pathToFile, 'utf8');
          readFiles.push({ filename: file, data: readFile });
        }
      }
      return readFiles;
    })
    .then(data => {
      const stream = createWriteStream(bundleDistPath, { encoding: 'utf8' });
      for (let file of data) {
        stream.write(file.data);
      }
      stream.close();
    });

}

function copyDir(pathToFolder, pathToNewFolder) {
  fs.mkdir(pathToNewFolder)
    .then(async () => {
      const files = await fs.readdir(pathToFolder, { withFileTypes: true });
      files.forEach(async (file) => {
        const pathFrom = path.join(pathToFolder, file.name);
        const pathTo = path.join(pathToNewFolder, file.name);
        if (file.isDirectory()) {
          copyDir(pathFrom, pathTo);
        } else {
          await fs.copyFile(pathFrom, pathTo);
        }
      });
    })
    .catch(async () => {
      await fs.rm(pathToNewFolder, { recursive: true });
      copyDir(pathToFolder, pathToNewFolder);
    });
}

buildPage();