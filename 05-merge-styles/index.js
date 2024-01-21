const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const output = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

async function createBundle() {
  let files = await readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });

  files = files.filter((item) => {
    const fileExtension = path.extname(path.join(item.path, item.name));
    return item.isFile() && fileExtension === '.css';
  });

  files.forEach((item) => {
    const filePath = path.join(item.path, item.name);
    const input = fs.createReadStream(filePath, 'utf-8');
    input.pipe(output);
  });
}

createBundle();
