# Docker

`nginx.docker.conf` + `proxy_params` configure the gateway container used by `docker-compose.yml`
(`/api` and `/images/uploads` → backend, `/admin` → admin, everything else → web).
The per-app Dockerfiles live next to their apps (`backend/`, `frontend/web/`, `frontend/admin/`).