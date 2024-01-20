const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, '02-write-file.txt'));

process.on('SIGINT', () => {
  stdout.write('\nGood text! Bye.\n');
  console.log();
  process.exit();
});

console.log('\nHello, hello! Please, write your text!\n');
stdin.on('data', (chunk) => {
  const text = chunk.toString();

  if (text.trim() === 'exit') {
    stdout.write('\nGood text! Bye.\n');
    console.log();
    process.exit();
  } else {
    output.write(text);
  }
});
