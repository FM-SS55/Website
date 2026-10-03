const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/httpError');
const Banner = require('../models/Banner');
const Service = require('../models/Service');
const Client = require('../models/Client');
const BlogPost = require('../models/BlogPost');
const homeService = require('../services/home.service');
const contactService = require('../services/contact.service');

exports.home = asyncHandler(async (req, res) => res.json(await homeService.getHome()));
exports.banners = asyncHandler(async (req, res) => res.json(await Banner.getActive()));
exports.services = asyncHandler(async (req, res) => res.json(await Service.getActive()));
exports.clients = asyncHandler(async (req, res) => res.json(await Client.getActive()));
exports.posts = asyncHandler(async (req, res) => res.json(await BlogPost.getPublished()));

exports.service = asyncHandler(async (req, res) => {
  const row = await Service.getBySlug(req.params.slug);
  if (!row) throw new HttpError(404, 'Service not found');
  res.json(row);
});

exports.post = asyncHandler(async (req, res) => {
  const row = await BlogPost.getBySlug(req.params.slug);
  if (!row) throw new HttpError(404, 'Post not found');
  res.json(row);
});

exports.contact = asyncHandler(async (req, res) => {
  await contactService.create(req.body);
  res.status(201).json({ ok: true });
});