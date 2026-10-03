module.exports = (body) => {
  const errors = [];
  if (!body.name || !String(body.name).trim()) errors.push('Name is required.');
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) errors.push('A valid email is required.');
  if (!body.message || !String(body.message).trim()) errors.push('Message is required.');
  if (body.name && String(body.name).length > 100) errors.push('Name is too long.');
  if (body.email && String(body.email).length > 150) errors.push('Email is too long.');
  if (body.phone && String(body.phone).length > 30) errors.push('Phone is too long.');
  if (body.message && String(body.message).length > 3000) errors.push('Message is too long (max 3000 characters).');
  return errors;
};