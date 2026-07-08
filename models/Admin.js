// models/Admin.js
// Single admin account used for the /admin login.

const bcrypt = require('bcryptjs');
const { run, get } = require('../config/db');

const Admin = {
  findByUsername(username) {
    return get('SELECT * FROM admins WHERE username = ?', [username]);
  },

  // Compares a plain-text password against the stored bcrypt hash.
  async verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
  },

  // Used if you ever add a "change password" form in the admin panel later.
  async updatePassword(username, newPlainPassword) {
    const hash = await bcrypt.hash(newPlainPassword, 10);
    return run('UPDATE admins SET password_hash = ? WHERE username = ?', [hash, username]);
  },
};

module.exports = Admin;