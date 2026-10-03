const crud = require('./crud.factory');
const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboard.service');
const contactService = require('../services/contact.service');
const Banner = require('../models/Banner');
const Service = require('../models/Service');
const Client = require('../models/Client');
const BlogPost = require('../models/BlogPost');

exports.banners = crud({ model: Banner, fields: ['title', 'subtitle', 'link_url', 'sort_order'], fileField: 'image', urlField: 'image_url' });
exports.services = crud({ model: Service, fields: ['title', 'slug', 'icon', 'short_description', 'full_description', 'sort_order'], fileField: 'image', urlField: 'image_url' });
exports.clients = crud({ model: Client, fields: ['name', 'sort_order'], fileField: 'logo', urlField: 'logo_url' });
exports.posts = crud({ model: BlogPost, fields: ['title', 'slug', 'excerpt', 'body', 'published_at'], boolFields: ['is_published'], fileField: 'image', urlField: 'image_url' });

exports.dashboard = asyncHandler(async (req, res) => res.json(await dashboardService.summary()));
exports.messages = asyncHandler(async (req, res) => res.json(await contactService.list()));
exports.readMessage = asyncHandler(async (req, res) => { await contactService.markRead(req.params.id); res.json({ ok: true }); });
exports.deleteMessage = asyncHandler(async (req, res) => { await contactService.remove(req.params.id); res.json({ ok: true }); });