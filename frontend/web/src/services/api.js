import { request } from '@shared/api';

export const api = {
  home: () => request('/home'),
  services: () => request('/services'),
  service: (slug) => request(`/services/${encodeURIComponent(slug)}`),
  clients: () => request('/clients'),
  posts: () => request('/blog'),
  post: (slug) => request(`/blog/${encodeURIComponent(slug)}`),
  sendContact: (payload) => request('/contact', { method: 'POST', body: payload }),
};