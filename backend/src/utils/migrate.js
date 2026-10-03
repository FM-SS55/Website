// src/utils/migrate.js
// Safe to run multiple times: uses CREATE TABLE IF NOT EXISTS, and only
// seeds the admin user / starter content if they don't already exist.
// Run with: npm run migrate

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const bcrypt = require('bcryptjs');
const { run, get } = require('../config/db');

async function migrate() {
  console.log('Running migrations...');

  // ---- admins ----
  await run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ---- banners (homepage hero slider) ----
  await run(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      image_url TEXT NOT NULL,
      link_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ---- services ----
  await run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT,
      short_description TEXT,
      full_description TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ---- clients ----
  await run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ---- blog_posts ----
  await run(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      body TEXT,
      image_url TEXT,
      is_published INTEGER DEFAULT 1,
      published_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ---- contact_messages (submissions from the public Contact Us form) ----
  await run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      is_read INTEGER DEFAULT 0
    )
  `);

  console.log('Tables ready.');

  // ---- seed admin user from .env (create once, or update password if it changed) ----
  const username = process.env.ADMIN_USER || 'admin';
  const plainPassword = process.env.ADMIN_PASS || 'change_this_password_before_deploy';
  if (process.env.NODE_ENV === 'production' && (plainPassword.length < 10 || /change_this|change_me/i.test(plainPassword))) {
    throw new Error('Set a strong ADMIN_PASS (10+ characters) in the environment before running in production.');
  }
  const hash = await bcrypt.hash(plainPassword, 10);

  const existing = await get('SELECT * FROM admins WHERE username = ?', [username]);
  if (!existing) {
    await run('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [username, hash]);
    console.log(`Admin user "${username}" created.`);
  } else {
    if (process.env.ADMIN_RESET_PASSWORD === 'true') {
      await run('UPDATE admins SET password_hash = ? WHERE username = ?', [hash, username]);
      console.log(`Admin "${username}" password reset from ADMIN_PASS. Remove ADMIN_RESET_PASSWORD afterwards.`);
    } else {
      console.log(`Admin user "${username}" already exists (set ADMIN_RESET_PASSWORD=true once to change its password).`);
    }
  }

  // ---- seed starter content only on first-ever run (so re-running migrate never duplicates rows) ----
  const serviceCount = await get('SELECT COUNT(*) as count FROM services');
  if (serviceCount.count === 0) {
    const services = [
      ['Mechanized Housekeeping', 'mechanized-housekeeping', 'sparkles', 'Machine-assisted cleaning for large commercial and residential floor areas.'],
      ['Landscaping & Gardening', 'landscaping-gardening', 'leaf', 'Indoor and outdoor landscaping, lawn care, and garden upkeep.'],
      ['Domestic Support Services', 'domestic-support', 'home', 'Trained household staff for daily domestic support.'],
      ['Electrical, Mechanical & Carpentry', 'electrical-mechanical-carpentry', 'wrench', 'On-site technical support for repairs and general maintenance.'],
      ['Pest Control & Sanitization', 'pest-control-sanitization', 'shield', 'Scheduled pest control and deep sanitization programs.'],
      ['Water Treatment Services', 'water-treatment', 'droplet', 'Water quality management for commercial and residential sites.'],
      ['Security Services', 'security-services', 'lock', 'Trained security personnel for premises of all sizes.'],
      ['Event Management', 'event-management', 'calendar', 'End-to-end support staff and logistics for events.'],
      ['Specialised Cooks & Kitchen Management', 'kitchen-management', 'chef-hat', 'Trained kitchen staff for institutional and corporate dining.'],
    ];
    for (let i = 0; i < services.length; i++) {
      const [title, slug, icon, short_description] = services[i];
      await run(
        `INSERT INTO services (title, slug, icon, short_description, full_description, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, slug, icon, short_description, short_description, i]
      );
    }
    console.log(`Seeded ${services.length} starter services.`);
  }

  const bannerCount = await get('SELECT COUNT(*) as count FROM banners');
  if (bannerCount.count === 0) {
    await run(
      `INSERT INTO banners (title, subtitle, image_url, sort_order, is_active) VALUES (?, ?, ?, ?, 1)`,
      ['Integrated Facility Management You Can Rely On', 'Housekeeping, security, landscaping and more — one accountable team.', '/images/uploads/placeholder-banner.jpg', 0]
    );
    console.log('Seeded 1 starter banner.');
  }

  console.log('Migration complete.');
}

module.exports = migrate;

// CLI usage: npm run migrate
if (require.main === module) {
  migrate().then(() => process.exit(0)).catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}