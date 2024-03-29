const { readdir, stat } = require('fs/promises');
const path = require('path');
const secretPath = path.join(`${__dirname}`, 'secret-folder');
readdir(secretPath, { withFileTypes: true }).then(
  function (secretPath) {
    for (const file of secretPath) {
      stat(path.join(`${file.path}`, `${file.name}`)).then((fileStats) => {
        if (fileStats.isFile()) {
          console.log(
            `${path.parse(file.name).name} - ${path
              .extname(file.name)
              .slice(1)} - ${fileStats.size / 1024} kb`,
          );
        }
      });
    }
  },
  function (err) {
    if (err) {
      console.error('Error:', err);
    }
  },
);
