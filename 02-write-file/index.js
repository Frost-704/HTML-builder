const readline = require('readline');
const path = require('path');
const fs = require('fs');
let rl = readline.createInterface(process.stdin);
console.log('Hello, please add a text');
rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    rl.close();
  } else {
    fs.writeFile(
      path.join(`${__dirname}`, 'text.txt'),
      `${input}\n`,
      { flag: 'a' },
      (err) => {
        if (err) {
          console.error('Error:', err);
        }
      },
    );
  }
});
process.on('SIGINT', () => rl.close());
rl.on('close', () => {
  console.log('Goodbye!');
});
