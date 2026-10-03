module.exports = (body) => {
  const errors = [];
  if (!body.name || !String(body.name).trim()) errors.push('Name is required.');
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) errors.push('A valid email is required.');
  if (!body.message || !String(body.message).trim()) errors.push('Message is required.');
  return errors;
};