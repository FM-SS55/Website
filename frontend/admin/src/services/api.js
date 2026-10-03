import { request } from '@shared/api';

const call = (path, opts = {}) =>
  request(path, { ...opts, onUnauthorized: () => window.dispatchEvent(new Event('admin:unauthorized')) });

export const authApi = {
  // login/me must not trigger the global "unauthorized" handler
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

export const dashboardApi = { get: () => call('/admin/dashboard') };

export const messagesApi = {
  list: () => call('/admin/messages'),
  markRead: (id) => call(`/admin/messages/${id}/read`, { method: 'PUT' }),
  remove: (id) => call(`/admin/messages/${id}`, { method: 'DELETE' }),
};

// Generic CRUD client; bodies are FormData (supports image upload)
export const resourceApi = (name) => ({
  list: () => call(`/admin/${name}`),
  get: (id) => call(`/admin/${name}/${id}`),
  create: (form) => call(`/admin/${name}`, { method: 'POST', body: form }),
  update: (id, form) => call(`/admin/${name}/${id}`, { method: 'PUT', body: form }),
  remove: (id) => call(`/admin/${name}/${id}`, { method: 'DELETE' }),
});