const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

async function getFiles() {
  console.log();
  let files = await readdir(path.join(__dirname, 'secret-folder'), {
    withFileTypes: true,
  });
  files = files.filter((item) => item.isFile());

  files.forEach((item, index) => {
    const filePath = path.join(item.path, item.name);
    const fileExtension = path.extname(filePath).replace('.', '');
    let fileName = path.basename(filePath);
    fileName = fileName.split('.').slice(0, 1).join('');

    fs.stat(filePath, (err, stats) => {
      const fileSizeKb = `${(stats.size / 1024).toFixed(3)}kb`;
      console.log(`${fileName} - ${fileExtension} - ${fileSizeKb}`);

      if (index === files.length - 1) {
        console.log();
      }
    });
  });
}

getFiles();
