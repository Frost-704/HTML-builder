const { readdir, readFile, writeFile, stat } = require('fs/promises');
const path = require('path');
const stylesPath = path.join(`${__dirname}`, 'styles');

async function makeBundle() {
  const files = await readdir(stylesPath);
  let stylesContent = '';
  for (const file of files) {
    const fileStats = await stat(path.join(`${stylesPath}`, `${file}`));
    if (path.extname(file) === '.css' && fileStats.isFile()) {
      const filePath = path.join(stylesPath, file);
      const text = await readFile(filePath, 'utf-8');
      stylesContent += text;
    }
  }
  writeFile(
    path.join(`${__dirname}`, 'project-dist', 'bundle.css'),
    stylesContent,
    { flag: 'a' },
    (err) => {
      if (err) {
        console.error('Error:', err);
      }
    },
  );
}

makeBundle();
