// routes/admin.js
// Everything under /admin. Protected by requireAuth except /admin/login.

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { requireAuth, redirectIfAuthed } = require('../middleware/auth');
const Admin = require('../models/Admin');
const Banner = require('../models/Banner');
const Service = require('../models/Service');
const Client = require('../models/Client');
const BlogPost = require('../models/BlogPost');
const { all, run } = require('../config/db');

// ---- Image upload setup ----
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'public', 'images', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_UPLOAD_MB, 10) || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Only image files are allowed (jpg, png, webp, gif).'), ok);
  },
});

// Helper: turn an uploaded file (if any) into a public URL, otherwise keep the existing value.
function resolveImageUrl(req, existingUrl) {
  if (req.file) return `/images/uploads/${req.file.filename}`;
  return req.body.image_url_existing || existingUrl || null;
}

// =================== AUTH ===================

router.get('/login', redirectIfAuthed, (req, res) => {
  res.render('admin/login', { title: 'Admin Login', error: null });
});

router.post('/login', redirectIfAuthed, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findByUsername(username);
    const valid = admin ? await Admin.verifyPassword(password, admin.password_hash) : false;

    if (!valid) {
      return res.status(401).render('admin/login', { title: 'Admin Login', error: 'Invalid username or password.' });
    }

    req.session.isAdmin = true;
    req.session.username = admin.username;
    const redirectTo = req.session.redirectAfterLogin || '/admin/dashboard';
    delete req.session.redirectAfterLogin;
    res.redirect(redirectTo);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// =================== DASHBOARD ===================

router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const [banners, services, clients, posts, messages] = await Promise.all([
      Banner.getAll(),
      Service.getAll(),
      Client.getAll(),
      BlogPost.getAll(),
      all('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5'),
    ]);
    res.render('admin/dashboard', {
      title: 'Dashboard',
      counts: {
        banners: banners.length,
        services: services.length,
        clients: clients.length,
        posts: posts.length,
      },
      recentMessages: messages,
    });
  } catch (err) {
    next(err);
  }
});

// =================== BANNERS ===================

router.get('/banners', requireAuth, async (req, res, next) => {
  try {
    res.render('admin/banners', { title: 'Manage Banners', banners: await Banner.getAll(), editing: null });
  } catch (err) { next(err); }
});

router.get('/banners/:id/edit', requireAuth, async (req, res, next) => {
  try {
    const editing = await Banner.getById(req.params.id);
    res.render('admin/banners', { title: 'Manage Banners', banners: await Banner.getAll(), editing });
  } catch (err) { next(err); }
});

router.post('/banners', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const { title, subtitle, link_url, sort_order, is_active } = req.body;
    const image_url = resolveImageUrl(req, null);
    await Banner.create({ title, subtitle, image_url, link_url, sort_order, is_active: is_active === 'on' });
    res.redirect('/admin/banners');
  } catch (err) { next(err); }
});

router.put('/banners/:id', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const existing = await Banner.getById(req.params.id);
    const { title, subtitle, link_url, sort_order, is_active } = req.body;
    const image_url = resolveImageUrl(req, existing ? existing.image_url : null);
    await Banner.update(req.params.id, { title, subtitle, image_url, link_url, sort_order, is_active: is_active === 'on' });
    res.redirect('/admin/banners');
  } catch (err) { next(err); }
});

router.delete('/banners/:id', requireAuth, async (req, res, next) => {
  try {
    await Banner.delete(req.params.id);
    res.redirect('/admin/banners');
  } catch (err) { next(err); }
});

// =================== SERVICES ===================

router.get('/services', requireAuth, async (req, res, next) => {
  try {
    res.render('admin/services', { title: 'Manage Services', services: await Service.getAll(), editing: null });
  } catch (err) { next(err); }
});

router.get('/services/:id/edit', requireAuth, async (req, res, next) => {
  try {
    const editing = await Service.getById(req.params.id);
    res.render('admin/services', { title: 'Manage Services', services: await Service.getAll(), editing });
  } catch (err) { next(err); }
});

router.post('/services', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const { title, slug, icon, short_description, full_description, sort_order, is_active } = req.body;
    const image_url = resolveImageUrl(req, null);
    await Service.create({ title, slug, icon, short_description, full_description, image_url, sort_order, is_active: is_active === 'on' });
    res.redirect('/admin/services');
  } catch (err) { next(err); }
});

router.put('/services/:id', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const existing = await Service.getById(req.params.id);
    const { title, slug, icon, short_description, full_description, sort_order, is_active } = req.body;
    const image_url = resolveImageUrl(req, existing ? existing.image_url : null);
    await Service.update(req.params.id, { title, slug, icon, short_description, full_description, image_url, sort_order, is_active: is_active === 'on' });
    res.redirect('/admin/services');
  } catch (err) { next(err); }
});

router.delete('/services/:id', requireAuth, async (req, res, next) => {
  try {
    await Service.delete(req.params.id);
    res.redirect('/admin/services');
  } catch (err) { next(err); }
});

// =================== CLIENTS ===================

router.get('/clients', requireAuth, async (req, res, next) => {
  try {
    res.render('admin/clients', { title: 'Manage Clients', clients: await Client.getAll(), editing: null });
  } catch (err) { next(err); }
});

router.get('/clients/:id/edit', requireAuth, async (req, res, next) => {
  try {
    const editing = await Client.getById(req.params.id);
    res.render('admin/clients', { title: 'Manage Clients', clients: await Client.getAll(), editing });
  } catch (err) { next(err); }
});

router.post('/clients', requireAuth, upload.single('logo'), async (req, res, next) => {
  try {
    const { name, sort_order, is_active } = req.body;
    const logo_url = req.file ? `/images/uploads/${req.file.filename}` : (req.body.logo_url_existing || null);
    await Client.create({ name, logo_url, sort_order, is_active: is_active === 'on' });
    res.redirect('/admin/clients');
  } catch (err) { next(err); }
});

router.put('/clients/:id', requireAuth, upload.single('logo'), async (req, res, next) => {
  try {
    const existing = await Client.getById(req.params.id);
    const { name, sort_order, is_active } = req.body;
    const logo_url = req.file ? `/images/uploads/${req.file.filename}` : (req.body.logo_url_existing || (existing ? existing.logo_url : null));
    await Client.update(req.params.id, { name, logo_url, sort_order, is_active: is_active === 'on' });
    res.redirect('/admin/clients');
  } catch (err) { next(err); }
});

router.delete('/clients/:id', requireAuth, async (req, res, next) => {
  try {
    await Client.delete(req.params.id);
    res.redirect('/admin/clients');
  } catch (err) { next(err); }
});

// =================== BLOG ===================

router.get('/blog', requireAuth, async (req, res, next) => {
  try {
    res.render('admin/blog', { title: 'Manage Blog', posts: await BlogPost.getAll(), editing: null });
  } catch (err) { next(err); }
});

router.get('/blog/:id/edit', requireAuth, async (req, res, next) => {
  try {
    const editing = await BlogPost.getById(req.params.id);
    res.render('admin/blog', { title: 'Manage Blog', posts: await BlogPost.getAll(), editing });
  } catch (err) { next(err); }
});

router.post('/blog', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const { title, slug, excerpt, body, is_published, published_at } = req.body;
    const image_url = resolveImageUrl(req, null);
    await BlogPost.create({ title, slug, excerpt, body, image_url, is_published: is_published === 'on', published_at });
    res.redirect('/admin/blog');
  } catch (err) { next(err); }
});

router.put('/blog/:id', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const existing = await BlogPost.getById(req.params.id);
    const { title, slug, excerpt, body, is_published, published_at } = req.body;
    const image_url = resolveImageUrl(req, existing ? existing.image_url : null);
    await BlogPost.update(req.params.id, { title, slug, excerpt, body, image_url, is_published: is_published === 'on', published_at });
    res.redirect('/admin/blog');
  } catch (err) { next(err); }
});

router.delete('/blog/:id', requireAuth, async (req, res, next) => {
  try {
    await BlogPost.delete(req.params.id);
    res.redirect('/admin/blog');
  } catch (err) { next(err); }
});

// =================== CONTACT MESSAGES (read-only + delete) ===================

router.get('/messages', requireAuth, async (req, res, next) => {
  try {
    const messages = await all('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.render('admin/messages', { title: 'Contact Messages', messages });
  } catch (err) { next(err); }
});

router.delete('/messages/:id', requireAuth, async (req, res, next) => {
  try {
    await run('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    res.redirect('/admin/messages');
  } catch (err) { next(err); }
});

module.exports = router;