const router = require('express').Router();
const c = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { login } = require('../validators/content.validator');

router.post('/login', validate(login), c.login);
router.post('/logout', c.logout);
router.get('/me', c.me);

module.exports = router;