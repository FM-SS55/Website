// Central place for environment-driven settings.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const fs = require('fs');
const root = path.join(__dirname, '..', '..');
// First existing candidate wins: monorepo build output, or the flat cPanel bundle.
const firstExisting = (list) => list.find((p) => fs.existsSync(p)) || null;

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  port: parseInt(process.env.PORT, 10) || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'dev_only_secret_change_me',
  databaseDir: path.join(__dirname, '..', '..', 'database'),
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads'),
  maxUploadMb: parseInt(process.env.MAX_UPLOAD_MB, 10) || 5,
  webDist: process.env.WEB_DIST || firstExisting([path.join(root, 'frontend-dist', 'web'), path.join(root, '..', 'frontend', 'web', 'dist')]),
  // folder that CONTAINS the 'admin' directory (admin is built with base /admin/)
  adminDist: process.env.ADMIN_DIST || firstExisting([path.join(root, 'frontend-dist', 'admin'), path.join(root, '..', 'frontend', 'admin', 'dist')]),
  corsOrigins: (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
};