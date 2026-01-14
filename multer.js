const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 1591;

/* ---------------- UPLOAD FOLDER ---------------- */
const uploadDir = path.join(__dirname, 'uploads');

/* create upload folder if not exists */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------- MULTER STORAGE ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // save location
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname)); // rename file
  }
});

/* ---------------- FILE FILTER ---------------- */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true); // allow
  } else {
    cb(null, false); // reject
  }
};

/* ---------------- MULTER CONFIG ---------------- */
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter
});

/* ---------------- SINGLE FILE UPLOAD ---------------- */
app.post('/upload-single', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.send('file rejected');
  }
  res.send('single file uploaded');
});

/* ---------------- MULTIPLE FILE UPLOAD ---------------- */
app.post('/upload-multiple', upload.array('photos', 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.send('no files uploaded');
  }
  res.send('multiple files uploaded');
});

/* ---------------- DELETE FILE ---------------- */
app.delete('/delete/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.send('file not found');
    }
    res.send('file deleted');
  });
});

/* ---------------- LIST FILES ---------------- */
app.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.send('error reading folder');
    res.json(files);
  });
});

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
