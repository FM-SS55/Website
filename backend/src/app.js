const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const fs = require('fs');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1); // behind the host's web server (LiteSpeed/Apache) — needed for secure cookies
app.disable('x-powered-by');

// Force HTTPS in production (the host terminates TLS and sets X-Forwarded-Proto).
if (config.isProd) {
  app.use((req, res, next) => {
    // Only redirect when the proxy explicitly says the request was plain HTTP (avoids loops if the header is absent).
    if (req.headers['x-forwarded-proto'] !== 'http' || req.path === '/api/health') return next();
    return res.redirect(301, `${config.siteUrl}${req.originalUrl}`);
  });
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: config.isProd ? [] : null,
      },
    },
    hsts: config.isProd ? { maxAge: 31536000, includeSubDomains: true } : false,
  })
);

const limiter = (windowMin, max, message) =>
  rateLimit({ windowMs: windowMin * 60 * 1000, max, standardHeaders: true, legacyHeaders: false, message: { error: message } });
app.use('/api/auth/login', limiter(15, 10, 'Too many login attempts. Please try again in 15 minutes.'));
app.use('/api/contact', limiter(60, 10, 'Too many messages sent. Please try again later.'));
app.use('/api', limiter(1, 300, 'Too many requests. Please slow down.'));

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

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

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