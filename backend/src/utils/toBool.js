// Multipart form fields arrive as strings: accept 'on', 'true', '1', true.
module.exports = (v) => v === true || v === 'true' || v === 'on' || v === '1' || v === 1;