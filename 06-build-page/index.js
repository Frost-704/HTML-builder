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

replaceTemplate();
