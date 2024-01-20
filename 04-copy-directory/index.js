const { rm, copyFile, readdir, mkdir } = require('fs/promises');
const path = require('path');

async function copyDir() {
  await mkdir(path.join(`${__dirname}`, 'files-copy'), { recursive: true });
  const originalPath = path.join(`${__dirname}`, 'files');
  const copyPath = path.join(`${__dirname}`, 'files-copy');
  await rm(copyPath, { recursive: true });
  await mkdir(path.join(`${__dirname}`, 'files-copy'), { recursive: true });
  const files = await readdir(originalPath);
  for (const file of files) {
    await copyFile(`${originalPath}/${file}`, `${copyPath}/${file}`);
  }
}
copyDir();
