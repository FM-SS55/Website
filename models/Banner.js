// models/Banner.js
// Homepage hero slider banners.

const { run, get, all } = require('../config/db');

const Banner = {
  // All banners, newest sort_order logic applied, for the admin list view (includes inactive ones)
  getAll() {
    return all('SELECT * FROM banners ORDER BY sort_order ASC, id ASC');
  },

  // Only active banners, for the public homepage slider
  getActive() {
    return all('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
  },

  getById(id) {
    return get('SELECT * FROM banners WHERE id = ?', [id]);
  },

  create({ title, subtitle, image_url, link_url, sort_order, is_active }) {
    return run(
      `INSERT INTO banners (title, subtitle, image_url, link_url, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, subtitle || null, image_url, link_url || null, sort_order || 0, is_active ? 1 : 0]
    );
  },

  update(id, { title, subtitle, image_url, link_url, sort_order, is_active }) {
    return run(
      `UPDATE banners SET title = ?, subtitle = ?, image_url = ?, link_url = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [title, subtitle || null, image_url, link_url || null, sort_order || 0, is_active ? 1 : 0, id]
    );
  },

  delete(id) {
    return run('DELETE FROM banners WHERE id = ?', [id]);
  },
};

module.exports = Banner;