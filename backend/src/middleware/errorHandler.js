const config = require('../config');

function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.code === 'LIMIT_FILE_SIZE') err.status = 400;
  const status = err.status || (/image files/.test(err.message) ? 400 : 500);
  if (status >= 500) console.error(err.stack);
  const body = { error: status >= 500 && config.isProd ? 'Something went wrong. Please try again later.' : err.message };
  if (err.details) body.details = err.details;
  res.status(status).json(body);
}

module.exports = { notFound, errorHandler };