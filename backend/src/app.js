const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const fs = require('fs');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1); // behind Nginx — needed for secure cookies

if (config.corsOrigins.length) {
  // Only needed when frontends run on other origins (e.g. Vite dev servers without proxy).
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && config.corsOrigins.includes(origin)) {
      res.set({ 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', Vary: 'Origin' });
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

fs.mkdirSync(config.databaseDir, { recursive: true });
app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: config.databaseDir }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8, httpOnly: true, sameSite: 'lax', secure: config.isProd },
  })
);

// Uploaded images keep the original public URL prefix (/images/uploads/...)
app.use('/images/uploads', express.static(config.uploadDir, { maxAge: '30d' }));

app.use('/api', routes);
app.use('/api', notFound); // unknown API paths -> JSON 404

// Single-process hosting (cPanel / Passenger): Express also serves the built React apps.
if (config.adminDist) {
  app.use(express.static(config.adminDist, { index: false, maxAge: '7d' })); // /admin/assets/*
  app.get(/^\/admin(\/.*)?$/, (req, res) => res.sendFile(path.join(config.adminDist, 'admin', 'index.html')));
}
if (config.webDist) {
  app.use(express.static(config.webDist, { maxAge: '7d', index: false }));
  app.get('*', (req, res) => res.sendFile(path.join(config.webDist, 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;