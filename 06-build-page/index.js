const {
  rm,
  copyFile,
  readdir,
  readFile,
  open,
  writeFile,
  stat,
  mkdir,
} = require('fs/promises');
const path = require('path');
const templatePath = path.join(`${__dirname}`, 'template.html');
const componentsPath = path.join(`${__dirname}`, 'components');
const templates = [];
let indexHtml = '';
const stylesPath = path.join(`${__dirname}`, 'styles');

async function replaceTemplate() {
  await mkdir(path.join(`${__dirname}`, 'project-dist'), { recursive: true });
  const template = await open(templatePath);
  const files = await readdir(componentsPath, { withFileTypes: true });
  for await (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      templates.push(file.name.replace('.html', ''));
    }
  }
  for await (let line of template.readLines()) {
    for await (const templateName of templates) {
      if (line.includes(templateName)) {
        let text = await readFile(
          path.join(`${componentsPath}`, `${templateName}.html`),
          'utf-8',
        );
        line = `${line.replace(`{{${templateName}}}`, `${text}`)}`;
      }
    }
    indexHtml += `${line}\n`;
  }
  await writeFile(
    path.join(`${__dirname}`, 'project-dist', 'index.html'),
    indexHtml,
    { flag: 'w' },
    (err) => {
      if (err) {
        console.error('Error:', err);
      }
    },
  );
}

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
  await writeFile(
    path.join(`${__dirname}`, 'project-dist', 'style.css'),
    stylesContent,
    { flag: 'w' },
    (err) => {
      if (err) {
        console.error('Error:', err);
      }
    },
  );
}
async function makeDirRecursive(currentPath, currentCopyPath) {
  const files = await readdir(currentPath);
  for (const file of files) {
    const fileStats = await stat(path.join(`${currentPath}`, `${file}`));
    if (fileStats.isDirectory()) {
      await mkdir(path.join(`${__dirname}`, 'project-dist', currentPath), {
        recursive: true,
      });
      console.log('dir');
      makeDirRecursive(currentPath, currentCopyPath);
    } else {
      await copyFile(
        `${path.join(`${currentPath}`, `${file}`)}`,
        `${path.join(`${currentCopyPath}`, `${file}`)}`,
      );
    }
  }
}
async function copyDir() {
  const originalPath = path.join(`${__dirname}`, 'assets');
  const copyPath = path.join(`${__dirname}`, 'project-dist', 'assets');
  await mkdir(path.join(`${__dirname}`, 'project-dist', 'assets'), {
    recursive: true,
  });
  await rm(copyPath, { recursive: true });
  await mkdir(path.join(`${__dirname}`, 'project-dist', 'assets'), {
    recursive: true,
  });
  const files = await readdir(originalPath);
  for (const file of files) {
    const currentPath = path.join(`${originalPath}`, `${file}`);
    const currentCopyPath = path.join(`${copyPath}`, `${file}`);
    const fileStats = await stat(path.join(`${originalPath}`, `${file}`));
    if (fileStats.isDirectory()) {
      await mkdir(path.join(`${__dirname}`, 'project-dist', 'assets', file), {
        recursive: true,
      });
      makeDirRecursive(currentPath, currentCopyPath);
    } else {
      await copyFile(
        `${path.join(`${originalPath}`, `${file}`)}`,
        `${path.join(`${copyPath}`, `${file}`)}`,
      );
    }
  }
}
async function buildProject() {
  await replaceTemplate();
  await makeBundle();
  await copyDir();
}
buildProject();
