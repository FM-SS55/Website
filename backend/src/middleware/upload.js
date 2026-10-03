const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

if (!fs.existsSync(config.uploadDir)) fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: config.maxUploadMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^\.(jpe?g|png|webp|gif)$/.test(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Only image files are allowed (jpg, png, webp, gif).'), ok);
  },
});