const router = require('express').Router();
const c = require('../controllers/public.controller');
const validate = require('../middleware/validate');
const contactValidator = require('../validators/contact.validator');

router.get('/home', c.home);
router.get('/banners', c.banners);
router.get('/services', c.services);
router.get('/services/:slug', c.service);
router.get('/clients', c.clients);
router.get('/blog', c.posts);
router.get('/blog/:slug', c.post);
router.post('/contact', validate(contactValidator), c.contact);

module.exports = router;