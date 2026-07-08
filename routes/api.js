// routes/api.js
// Small read-only JSON API over the public content. Not required for the
// server-rendered pages to work, but handy if main.js ever wants to fetch
// data client-side (e.g. refreshing the hero slider without a full reload).

const express = require('express');
const router = express.Router();

const Banner = require('../models/Banner');
const Service = require('../models/Service');
const Client = require('../models/Client');
const BlogPost = require('../models/BlogPost');

router.get('/banners', async (req, res, next) => {
  try {
    res.json(await Banner.getActive());
  } catch (err) { next(err); }
});

router.get('/services', async (req, res, next) => {
  try {
    res.json(await Service.getActive());
  } catch (err) { next(err); }
});

router.get('/services/:slug', async (req, res, next) => {
  try {
    const service = await Service.getBySlug(req.params.slug);
    if (!service) return res.status(404).json({ error: 'Not found' });
    res.json(service);
  } catch (err) { next(err); }
});

router.get('/clients', async (req, res, next) => {
  try {
    res.json(await Client.getActive());
  } catch (err) { next(err); }
});

router.get('/blog', async (req, res, next) => {
  try {
    res.json(await BlogPost.getPublished());
  } catch (err) { next(err); }
});

module.exports = router;
