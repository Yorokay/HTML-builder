const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

async function copyDir() {
  await fsPromises.mkdir(path.join(__dirname, 'files-copy'), {
    recursive: true,
  });

  const copiedFiles = await fsPromises.readdir(
    path.join(__dirname, 'files-copy'),
  );

  if (copiedFiles.length > 0) {
    copiedFiles.forEach((item) => {
      fs.unlink(path.join(__dirname, 'files-copy', item), (err) => {
        if (err) {
          console.log(`Error: ${err}`);
        }
      });
    });
  }

  const files = await fsPromises.readdir(path.join(__dirname, 'files'));

  files.forEach((item) => {
    fs.copyFile(
      path.join(__dirname, 'files', item),
      path.join(__dirname, 'files-copy', item),
      (err) => {
        if (err) console.log(`Error: ${err}`);
      },
    );
  });
}

copyDir();
