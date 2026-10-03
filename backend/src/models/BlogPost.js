// models/BlogPost.js
// Blog listing + individual post pages.

const { run, get, all } = require('../config/db');

const BlogPost = {
  // All posts for the admin list view (includes unpublished drafts)
  getAll() {
    return all('SELECT * FROM blog_posts ORDER BY published_at DESC, id DESC');
  },

  // Only published posts, for the public blog listing page
  getPublished() {
    return all('SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC, id DESC');
  },

  getById(id) {
    return get('SELECT * FROM blog_posts WHERE id = ?', [id]);
  },

  // Used by the public single-post page (e.g. /blog/kpis-in-facility-management)
  getBySlug(slug) {
    return get('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1', [slug]);
  },

  create({ title, slug, excerpt, body, image_url, is_published, published_at }) {
    return run(
      `INSERT INTO blog_posts (title, slug, excerpt, body, image_url, is_published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, excerpt || null, body || null, image_url || null, is_published ? 1 : 0, published_at || new Date().toISOString()]
    );
  },

  update(id, { title, slug, excerpt, body, image_url, is_published, published_at }) {
    return run(
      `UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, body = ?, image_url = ?, is_published = ?, published_at = ?
       WHERE id = ?`,
      [title, slug, excerpt || null, body || null, image_url || null, is_published ? 1 : 0, published_at, id]
    );
  },

  delete(id) {
    return run('DELETE FROM blog_posts WHERE id = ?', [id]);
  },
};

module.exports = BlogPost;