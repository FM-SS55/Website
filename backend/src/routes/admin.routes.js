const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const v = require('../validators/content.validator');
const c = require('../controllers/admin.controller');

router.use(requireAuth);

router.get('/dashboard', c.dashboard);

function mount(path, handlers, field, validator) {
  router.get(`/${path}`, handlers.list);
  router.get(`/${path}/:id`, handlers.get);
  router.post(`/${path}`, upload.single(field), validate(validator), handlers.create);
  router.put(`/${path}/:id`, upload.single(field), handlers.update);
  router.delete(`/${path}/:id`, handlers.remove);
}
mount('banners', c.banners, 'image', v.banner);
mount('services', c.services, 'image', v.service);
mount('clients', c.clients, 'logo', v.client);
mount('blog', c.posts, 'image', v.post);

router.get('/messages', c.messages);
router.put('/messages/:id/read', c.readMessage);
router.delete('/messages/:id', c.deleteMessage);

module.exports = router;