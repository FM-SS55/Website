// routes/pages.js
// Public-facing pages. All content is pulled live from SQLite via the models,
// so anything changed in /admin shows up here immediately.

const express = require('express');
const router = express.Router();

const Banner = require('../models/Banner');
const Service = require('../models/Service');
const Client = require('../models/Client');
const BlogPost = require('../models/BlogPost');
const { run } = require('../config/db');

// ---- Home ----
router.get('/', async (req, res, next) => {
  try {
    const [banners, services, clients, posts] = await Promise.all([
      Banner.getActive(),
      Service.getActive(),
      Client.getActive(),
      BlogPost.getPublished(),
    ]);
    res.render('public/index', {
      title: 'Pulizia FM Services | Integrated Facility Management',
      banners,
      services,
      clients: clients.slice(0, 12), // show a manageable strip on the homepage
      latestPosts: posts.slice(0, 3),
    });
  } catch (err) {
    next(err);
  }
});

// ---- About ----
router.get('/about', (req, res) => {
  res.render('public/about', { title: 'About Us | Pulizia FM Services' });
});

// ---- Services (overview grid) ----
router.get('/services', async (req, res, next) => {
  try {
    const services = await Service.getActive();
    res.render('public/services', { title: 'Our Services | Pulizia FM Services', services });
  } catch (err) {
    next(err);
  }
});

// ---- Single service detail page, e.g. /services/mechanized-housekeeping ----
router.get('/services/:slug', async (req, res, next) => {
  try {
    const service = await Service.getBySlug(req.params.slug);
    if (!service) {
      return res.status(404).render('public/404', { title: 'Service Not Found' });
    }
    res.render('public/service-detail', {
      title: `${service.title} | Pulizia FM Services`,
      service,
    });
  } catch (err) {
    next(err);
  }
});

// ---- Clients ----
router.get('/clients', async (req, res, next) => {
  try {
    const clients = await Client.getActive();
    res.render('public/clients', { title: 'Our Valued Clients | Pulizia FM Services', clients });
  } catch (err) {
    next(err);
  }
});

// ---- Blog listing ----
router.get('/blog', async (req, res, next) => {
  try {
    const posts = await BlogPost.getPublished();
    res.render('public/blog', { title: 'Blog | Pulizia FM Services', posts });
  } catch (err) {
    next(err);
  }
});

// ---- Single blog post, e.g. /blog/kpis-in-facility-management ----
router.get('/blog/:slug', async (req, res, next) => {
  try {
    const post = await BlogPost.getBySlug(req.params.slug);
    if (!post) {
      return res.status(404).render('public/404', { title: 'Post Not Found' });
    }
    res.render('public/blog-post', { title: `${post.title} | Pulizia FM Services`, post });
  } catch (err) {
    next(err);
  }
});

// ---- Contact page (form) ----
router.get('/contact', (req, res) => {
  res.render('public/contact', { title: 'Contact Us | Pulizia FM Services', submitted: false });
});

// ---- Contact form submission ----
router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).render('public/contact', {
        title: 'Contact Us | Pulizia FM Services',
        submitted: false,
        error: 'Name, email, and message are required.',
      });
    }
    await run(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, message]
    );
    res.render('public/contact', { title: 'Contact Us | Pulizia FM Services', submitted: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;