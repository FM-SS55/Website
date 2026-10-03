// models/Client.js
// "Our Valued Clients" logos/names shown on the homepage and Clients page.

const { run, get, all } = require('../config/db');

const Client = {
  getAll() {
    return all('SELECT * FROM clients ORDER BY sort_order ASC, id ASC');
  },

  getActive() {
    return all('SELECT * FROM clients WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
  },

  getById(id) {
    return get('SELECT * FROM clients WHERE id = ?', [id]);
  },

  create({ name, logo_url, sort_order, is_active }) {
    return run(
      `INSERT INTO clients (name, logo_url, sort_order, is_active) VALUES (?, ?, ?, ?)`,
      [name, logo_url || null, sort_order || 0, is_active ? 1 : 0]
    );
  },

  update(id, { name, logo_url, sort_order, is_active }) {
    return run(
      `UPDATE clients SET name = ?, logo_url = ?, sort_order = ?, is_active = ? WHERE id = ?`,
      [name, logo_url || null, sort_order || 0, is_active ? 1 : 0, id]
    );
  },

  delete(id) {
    return run('DELETE FROM clients WHERE id = ?', [id]);
  },
};

module.exports = Client;