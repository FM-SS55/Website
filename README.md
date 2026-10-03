# Pulizia FM Services

Website, admin panel and API for Pulizia FM Services.

```
Website/
├── frontend/
│   ├── web/      public site (React + Vite)         → served at /
│   ├── admin/    admin panel (React + Vite)         → served at /admin
│   └── shared/   api client, hooks, utils, components used by both (@shared alias)
├── backend/      REST API (Express + SQLite)        → /api
├── devops/       nginx configs, docker gateway, server scripts, monitoring
├── .github/workflows/deploy.yml   CI/CD (push to main → deploy)
├── docker-compose.yml
└── package.json  npm workspaces + root scripts
```

## Local development

Requires Node 18+.

```bash
npm install                       # installs all workspaces
cp backend/.env.example backend/.env   # set SESSION_SECRET, ADMIN_USER, ADMIN_PASS
npm run migrate                   # creates backend/database/pulizia.sqlite, admin user, starter content
npm run dev                       # api :3000, web :5173, admin :5174/admin/
```

- Public site: http://localhost:5173
- Admin panel: http://localhost:5174/admin/ (log in with `ADMIN_USER` / `ADMIN_PASS`)

Vite proxies `/api` and `/images/uploads` to the backend, so no CORS setup is needed.

## API overview (`backend/src/routes`)

| Public | |
|---|---|
| `GET /api/home` | banners, services, clients, latest posts |
| `GET /api/services`, `/api/services/:slug` | |
| `GET /api/clients`, `/api/blog`, `/api/blog/:slug` | |
| `POST /api/contact` | contact form |

| Auth | |
|---|---|
| `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | session cookie |

| Admin (login required) | |
|---|---|
| `/api/admin/{banners,services,clients,blog}` | `GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id` (multipart for image upload) |
| `GET /api/admin/dashboard` | counts + recent messages |
| `/api/admin/messages` | `GET`, `PUT /:id/read`, `DELETE /:id` |

Backend layers: `routes → controllers → services → models → config/db`.

## Production

### Option A — Docker

```bash
cp .env.example .env     # edit secrets
docker compose up -d --build
```

nginx (container) routes `/api` + `/images/uploads` → backend, `/admin` → admin, `/` → web.
SQLite DB and uploads live in the `db-data` / `upload-data` volumes.
In production the session cookie is `Secure`, so put HTTPS in front (e.g. certbot / a TLS proxy).

### Option B — Lightsail + systemd + host Nginx

1. Run `devops/scripts/setup-server.sh` on a fresh Ubuntu server (edit `REPO_URL` first).
2. Set your domain in `devops/nginx/nginx.conf`, then `sudo certbot --nginx -d yourdomain.com`.
3. Add the GitHub secrets `LIGHTSAIL_HOST`, `LIGHTSAIL_USER`, `LIGHTSAIL_SSH_KEY`.
4. Every push to `main` runs `devops/scripts/deploy.sh` (pull → install → build → migrate → restart).

Useful: `sudo systemctl status pulizia`, `sudo journalctl -u pulizia -f`.

### Backups

`devops/scripts/backup.sh` copies `backend/database/pulizia.sqlite` and `backend/uploads/`.
Those two are the only state that matters.

## Notes

- Existing uploaded-image URLs (`/images/uploads/...`) keep working; move old files into `backend/uploads/`.
- Run `npm install` once to generate `package-lock.json`, commit it, and switch `deploy.sh` to `npm ci`.