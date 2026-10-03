const router = require('express').Router();
router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', require('./auth.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/', require('./public.routes'));
module.exports = router;