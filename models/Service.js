// models/Service.js
// Facility management services (Housekeeping, Security, Landscaping, etc.)

const { run, get, all } = require('../config/db');

const Service = {
  // All services for the admin list view (includes inactive ones)
  getAll() {
    return all('SELECT * FROM services ORDER BY sort_order ASC, id ASC');
  },

  // Only active services, for the public Services page / homepage grid
  getActive() {
    return all('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
  },

  getById(id) {
    return get('SELECT * FROM services WHERE id = ?', [id]);
  },

  // Used by the public service-detail page (e.g. /services/mechanized-housekeeping)
  getBySlug(slug) {
    return get('SELECT * FROM services WHERE slug = ? AND is_active = 1', [slug]);
  },

  create({ title, slug, icon, short_description, full_description, image_url, sort_order, is_active }) {
    return run(
      `INSERT INTO services (title, slug, icon, short_description, full_description, image_url, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, icon || null, short_description || null, full_description || null, image_url || null, sort_order || 0, is_active ? 1 : 0]
    );
  },

  update(id, { title, slug, icon, short_description, full_description, image_url, sort_order, is_active }) {
    return run(
      `UPDATE services SET title = ?, slug = ?, icon = ?, short_description = ?, full_description = ?,
       image_url = ?, sort_order = ?, is_active = ? WHERE id = ?`,
      [title, slug, icon || null, short_description || null, full_description || null, image_url || null, sort_order || 0, is_active ? 1 : 0, id]
    );
  },

  delete(id) {
    return run('DELETE FROM services WHERE id = ?', [id]);
  },
};

module.exports = Service;