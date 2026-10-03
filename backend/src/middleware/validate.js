// Runs a validator (req.body -> array of error strings) and rejects with 400.
const HttpError = require('../utils/httpError');
module.exports = (validator) => (req, res, next) => {
  const errors = validator(req.body || {}, req);
  if (errors.length) return next(new HttpError(400, errors[0], errors));
  next();
};