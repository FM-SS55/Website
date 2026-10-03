// Minimal fetch wrapper used by both frontends. Same-origin by default (/api),
// proxied to the backend in dev (Vite) and in prod (Nginx).
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function request(path, { method = 'GET', body, onUnauthorized } = {}) {
  const opts = { method, credentials: 'include', headers: {} };
  if (body instanceof FormData) {
    opts.body = body; // browser sets the multipart boundary
  } else if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`/api${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && onUnauthorized) onUnauthorized();
    throw new ApiError(res.status, data.error || `Request failed (${res.status})`);
  }
  return data;
}