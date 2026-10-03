// Builds list/get/create/update/remove handlers for a model.
//   fields:    body keys copied into the model
//   fileField: multipart field name for the image ('image' | 'logo')
//   urlField:  model column that stores the uploaded file URL ('image_url' | 'logo_url')
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/httpError');
const toBool = require('../utils/toBool');

module.exports = function crud({ model, fields, boolFields = ['is_active'], fileField, urlField }) {
  function buildData(req, existing) {
    const data = {};
    fields.forEach((f) => { data[f] = req.body[f] !== undefined ? req.body[f] : existing ? existing[f] : undefined; });
    boolFields.forEach((f) => { data[f] = req.body[f] !== undefined ? toBool(req.body[f]) : existing ? !!existing[f] : false; });
    if (fileField) {
      if (req.file) data[urlField] = `/images/uploads/${req.file.filename}`;
      else if (toBool(req.body.remove_image)) data[urlField] = null;
      else data[urlField] = existing ? existing[urlField] : null;
    }
    return data;
  }

  const wrap = (e) => {
    if (e && /UNIQUE/.test(e.message)) throw new HttpError(409, 'That slug/value is already in use.');
    throw e;
  };

  return {
    list: asyncHandler(async (req, res) => res.json(await model.getAll())),
    get: asyncHandler(async (req, res) => {
      const row = await model.getById(req.params.id);
      if (!row) throw new HttpError(404, 'Not found');
      res.json(row);
    }),
    create: asyncHandler(async (req, res) => {
      const { id } = await model.create(buildData(req, null)).catch(wrap);
      res.status(201).json(await model.getById(id));
    }),
    update: asyncHandler(async (req, res) => {
      const existing = await model.getById(req.params.id);
      if (!existing) throw new HttpError(404, 'Not found');
      await model.update(req.params.id, buildData(req, existing)).catch(wrap);
      res.json(await model.getById(req.params.id));
    }),
    remove: asyncHandler(async (req, res) => {
      await model.delete(req.params.id);
      res.json({ ok: true });
    }),
  };
};