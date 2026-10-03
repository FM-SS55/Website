const Admin = require('../models/Admin');

async function authenticate(username, password) {
  const admin = await Admin.findByUsername(username);
  if (!admin) return null;
  const ok = await Admin.verifyPassword(password, admin.password_hash);
  return ok ? admin : null;
}
module.exports = { authenticate };