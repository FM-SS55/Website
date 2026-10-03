// Central place for environment-driven settings.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const fs = require('fs');
const root = path.join(__dirname, '..', '..');
// First existing candidate wins: monorepo build output, or the flat cPanel bundle.
const firstExisting = (list) => list.find((p) => fs.existsSync(p)) || null;

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  const secret = process.env.SESSION_SECRET || '';
  if (secret.length < 32 || /replace_with|change_me|dev_only/i.test(secret)) {
    console.error('FATAL: set SESSION_SECRET (32+ random characters) in the environment before running in production.');
    process.exit(1);
  }
}

const dbPath = process.env.DB_PATH || path.join(root, 'database', 'mandafia.sqlite');

module.exports = {
  isProd,
  port: parseInt(process.env.PORT, 10) || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'dev_only_secret_change_me',
  dbPath,
  databaseDir: path.dirname(dbPath), // sessions DB lives next to the main DB (outside the app folder in production)
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads'),
  maxUploadMb: parseInt(process.env.MAX_UPLOAD_MB, 10) || 5,
  webDist: process.env.WEB_DIST || firstExisting([path.join(root, 'frontend-dist', 'web'), path.join(root, '..', 'frontend', 'web', 'dist')]),
  // folder that CONTAINS the 'admin' directory (admin is built with base /admin/)
  adminDist: process.env.ADMIN_DIST || firstExisting([path.join(root, 'frontend-dist', 'admin'), path.join(root, '..', 'frontend', 'admin', 'dist')]),
  siteUrl: process.env.SITE_URL || 'https://mandafiaservices.com',
  corsOrigins: (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
};