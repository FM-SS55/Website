// middleware/auth.js
// Protects all /admin/* routes except the login page itself.
// A logged-in session sets req.session.isAdmin = true (done in routes/admin.js on successful login).

function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  // Not logged in: send them to the login page, remember where they were headed.
  req.session.redirectAfterLogin = req.originalUrl;
  return res.redirect('/admin/login');
}

// Opposite guard: if you're already logged in, skip the login page and go straight to the dashboard.
function redirectIfAuthed(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  return next();
}

module.exports = { requireAuth, redirectIfAuthed };
