// Required-field checks for admin CRUD. `required` lists mandatory body keys.
const make = (required) => (body) =>
  required.filter((k) => !body[k] || !String(body[k]).trim()).map((k) => `${k} is required.`);

module.exports = {
  banner: make(['title']),
  service: make(['title', 'slug']),
  client: make(['name']),
  post: make(['title', 'slug']),
  login: make(['username', 'password']),
};