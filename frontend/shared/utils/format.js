export const formatDate = (d) => (d ? new Date(d).toDateString() : '');
export const formatDateTime = (d) => (d ? new Date(d).toLocaleString() : '');
export const truncate = (s = '', n = 60) => (s.length > n ? `${s.slice(0, n)}…` : s);
export const slugify = (s = '') =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');