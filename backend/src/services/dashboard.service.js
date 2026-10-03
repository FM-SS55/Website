const Banner = require('../models/Banner');
const Service = require('../models/Service');
const Client = require('../models/Client');
const BlogPost = require('../models/BlogPost');
const contact = require('./contact.service');

async function summary() {
  const [banners, services, clients, posts, recentMessages] = await Promise.all([
    Banner.getAll(), Service.getAll(), Client.getAll(), BlogPost.getAll(), contact.recent(5),
  ]);
  return {
    counts: { banners: banners.length, services: services.length, clients: clients.length, posts: posts.length },
    recentMessages,
  };
}
module.exports = { summary };