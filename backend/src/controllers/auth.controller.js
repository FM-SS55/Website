const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

exports.login = asyncHandler(async (req, res) => {
  const admin = await authService.authenticate(req.body.username, req.body.password);
  if (!admin) return res.status(401).json({ error: 'Invalid username or password.' });
  // Regenerate the session id on login to prevent session fixation.
  req.session.regenerate((err) => {
    if (err) throw err;
    req.session.isAdmin = true;
    req.session.username = admin.username;
    res.json({ username: admin.username });
  });
});

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
};

exports.me = (req, res) => {
  if (req.session && req.session.isAdmin) return res.json({ username: req.session.username });
  res.status(401).json({ error: 'Not authenticated' });
};