# Monitoring

- `healthcheck.sh` – polls `GET /api/health`; run from cron or an external uptime monitor.
- Logs: `sudo journalctl -u pulizia -f` (systemd) or `docker compose logs -f backend` (Docker).