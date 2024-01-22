const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

async function copyAllFiles(copyPath, finalPath) {
  await fsPromises.mkdir(finalPath, {
    recursive: true,
  });
  const filesToCopy = await fsPromises.readdir(copyPath, {
    withFileTypes: true,
  });

  filesToCopy.forEach((item) => {
    const itemSrcPath = path.join(copyPath, item.name);
    const itemDestPath = path.join(finalPath, item.name);
    if (item.isFile()) {
      fs.copyFile(itemSrcPath, itemDestPath, (err) => {
        if (err) console.log(`Error: ${err}`);
      });
    } else if (item.isDirectory()) {
      copyAllFiles(itemSrcPath, path.join(finalPath, item.name));
    }
  });
}

async function createCssBundle() {
  const output = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
  );
  let files = await fsPromises.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });
  files = files.filter((item) => {
    const fileExtension = path.extname(path.join(item.path, item.name));
    return item.isFile() && fileExtension === '.css';
  });

  files.forEach((item) => {
    const filePath = path.join(item.path, item.name);
    const input = fs.createReadStream(filePath, 'utf-8');
    fs.stat(filePath, (err, stats) => {
      if (stats.size) {
        input.pipe(output);
      }
    });
  });
}

async function buildPage() {
  await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });

  let componentsFiles = await fsPromises.readdir(
    path.join(__dirname, 'components'),
    {
      withFileTypes: true,
    },
  );
  componentsFiles = componentsFiles.filter((item) => {
    const filePath = path.join(item.path, item.name);
    const fileExtension = path.extname(filePath);
    return item.isFile() && fileExtension === '.html';
  });

  fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
    (err, templateData) => {
      const output = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'index.html'),
        'utf-8',
      );
      let counter = 0;
      componentsFiles.forEach((item) => {
        const filePath = path.join(item.path, item.name);
        const fileExtension = path.extname(filePath);
        const fileOnlyName = item.name.replace(fileExtension, '');

        fs.readFile(filePath, (err, fileData) => {
          counter++;
          console.log(counter);
          console.log(templateData.includes(`{{${fileOnlyName}}}`));
          templateData = templateData.replace(`{{${fileOnlyName}}}`, fileData);
          if (counter === componentsFiles.length) {
            output.write(templateData);
          }
        });
      });
    },
  );

  copyAllFiles(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets'),
  );

  createCssBundle();
}

fs.stat(path.join(__dirname, 'project-dist'), (err, stats) => {
  if (stats) {
    fs.rm(path.join(__dirname, 'project-dist'), { recursive: true }, () => {
      buildPage();
    });
  } else {
    buildPage();
  }
});
