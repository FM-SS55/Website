const Banner = require('../models/Banner');
const Service = require('../models/Service');
const Client = require('../models/Client');
const BlogPost = require('../models/BlogPost');

async function getHome() {
  const [banners, services, clients, posts] = await Promise.all([
    Banner.getActive(), Service.getActive(), Client.getActive(), BlogPost.getPublished(),
  ]);
  return { banners, services, clients: clients.slice(0, 12), latestPosts: posts.slice(0, 3) };
}
module.exports = { getHome };