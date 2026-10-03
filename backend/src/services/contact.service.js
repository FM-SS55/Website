const { run, all } = require('../config/db');

module.exports = {
  create: ({ name, email, phone, message }) =>
    run('INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)', [name.trim(), email.trim(), phone || null, message.trim()]),
  list: () => all('SELECT * FROM contact_messages ORDER BY created_at DESC'),
  recent: (n = 5) => all('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ?', [n]),
  markRead: (id) => run('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]),
  remove: (id) => run('DELETE FROM contact_messages WHERE id = ?', [id]),
};