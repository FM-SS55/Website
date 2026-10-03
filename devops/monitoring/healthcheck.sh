#!/usr/bin/env bash
# Cron-friendly uptime check: exits non-zero if the API is down.
#   */5 * * * * /var/www/pulizia-fm/devops/monitoring/healthcheck.sh || echo "Pulizia API down" | mail -s ALERT you@example.com
URL="${1:-http://127.0.0.1:3000/api/health}"
curl -fsS --max-time 5 "$URL" > /dev/null