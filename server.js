// server.js
// Main entry point. Run with: npm start (production) or npm run dev (nodemon).

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const methodOverride = require('method-override');
const path = require('path');

const pageRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- View engine ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- Core middleware ----
app.use(express.urlencoded({ extended: true })); // parse HTML form submissions
app.use(express.json()); // parse JSON bodies (used by api.js)
app.use(methodOverride('_method')); // lets forms send PUT/DELETE via a hidden ?_method= field
app.use(express.static(path.join(__dirname, 'public'))); // serve /public as static files (css, js, images, uploads)

// ---- Sessions (stored in SQLite so logins survive server restarts) ----
app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: path.join(__dirname, 'database') }),
    secret: process.env.SESSION_SECRET || 'dev_only_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 8, // 8 hour login session
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // requires HTTPS in production (set up via certbot)
    },
  })
);

// ---- Make site-wide values available in every EJS template without passing them manually ----
app.use((req, res, next) => {
  res.locals.siteUrl = process.env.SITE_URL || `http://localhost:${PORT}`;
  res.locals.isAdmin = !!(req.session && req.session.isAdmin);
  res.locals.currentPath = req.path;
  next();
});

// ---- Routes ----
app.use('/api', apiRoutes); // JSON endpoints: /api/banners, /api/services, etc.
app.use('/admin', adminRoutes); // admin panel: login, dashboard, CRUD screens
app.use('/', pageRoutes); // public site: home, about, services, clients, blog, contact

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).render('public/404', { title: 'Page Not Found' });
});

// ---- Error handler ----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong. Please try again later.');
});

app.listen(PORT, () => {
  console.log(`Pulizia FM server running on port ${PORT}`);
});