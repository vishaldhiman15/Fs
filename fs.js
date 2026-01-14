const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 1591;

/* ---------------- FILE PATH ---------------- */
const file = "/Users/tourist/Fs/Scripts/vishal.txt";

/* ---------------- READ FILE ---------------- */
fs.readFile(file, 'utf-8', (err, data) => {
  if (err) {
    console.log('cannot able to read file');
  } else {
    console.log(data);

    /* append new data to file */
    fs.appendFile(
      file,
      '\n Solution -> if you understand mistake no one ever beat you',
      (err) => {
        if (err) console.log('file not modified');
        else console.log('file modified');
      }
    );
  }
});

/* ---------------- WRITE FILE ---------------- */
fs.writeFile(
  '/Users/tourist/Fs/Scripts/newFile.txt',
  'Initial Data',
  () => {}
);

/* append data */
fs.appendFile(
  '/Users/tourist/Fs/Scripts/newFile.txt',
  '\nMore Data',
  () => {}
);

/* cut file size */
fs.truncate(
  '/Users/tourist/Fs/Scripts/newFile.txt',
  10,
  () => {}
);

/* rename file */
fs.rename(
  '/Users/tourist/Fs/Scripts/newFile.txt',
  '/Users/tourist/Fs/Scripts/renamedFile.txt',
  () => {}
);

/* delete file */
fs.unlink(
  '/Users/tourist/Fs/Scripts/deleteMe.txt',
  (err) => {
    if (err) console.log('file not deleted');
  }
);

/* ---------------- FOLDER OPERATIONS ---------------- */

/* create folder */
fs.mkdir(
  '/Users/tourist/Fs/Scripts/F2',
  { recursive: true },
  () => {}
);

/* remove folder */
fs.rmdir(
  '/Users/tourist/Fs/Scripts/F2',
  { recursive: true },
  () => {}
);

/* ---------------- READ DIRECTORY ---------------- */
const folderPath = path.join("/Users/tourist/Fs/Scripts/F1");

/* check folder exists */
if (!fs.existsSync(folderPath)) {
  console.log('folder does not exist');
  process.exit(1);
}

/* list files & folders */
fs.readdir(folderPath, (err, items) => {
  if (err) return;

  items.forEach((item) => {
    const itemPath = path.join(folderPath, item);

    fs.stat(itemPath, (err, stats) => {
      if (err) return;

      if (stats.isFile()) console.log('File:', item);
      if (stats.isDirectory()) console.log('Folder:', item);
    });
  });
});

/* ---------------- COPY TXT FILES ---------------- */
const sourceDir = path.join(__dirname, 'myNotes');
const backupDir = path.join(__dirname, 'backupNotes');

/* source check */
if (!fs.existsSync(sourceDir)) process.exit(1);

/* destination create */
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

/* copy .txt files */
fs.readdir(sourceDir, (err, items) => {
  if (err) return;

  items.forEach((item) => {
    const sourcePath = path.join(sourceDir, item);

    fs.stat(sourcePath, (err, stats) => {
      if (err) return;

      if (stats.isFile() && path.extname(item) === '.txt') {
        fs.copyFile(
          sourcePath,
          path.join(backupDir, item),
          () => {}
        );
      }
    });
  });
});

/* sync copy */
fs.copyFileSync(
  '/Users/tourist/Fs/Scripts/vishal.txt',
  '/Users/tourist/Fs/Scripts/vishal-copy.txt'
);

/* open file */
fs.open(
  '/Users/tourist/Fs/Scripts/openFile.txt',
  'w',
  () => {}
);

/* check file access */
fs.access(
  '/Users/tourist/Fs/Scripts/vishal.txt',
  fs.constants.F_OK,
  (err) => {
    if (!err) console.log('file exists');
  }
);

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
