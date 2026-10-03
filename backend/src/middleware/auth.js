// Protects /api/admin/* — responds 401 JSON (the admin SPA redirects to its login page).
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ error: 'Authentication required' });
}
module.exports = { requireAuth };