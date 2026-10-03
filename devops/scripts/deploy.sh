#!/usr/bin/env bash
# Run on the server (called by GitHub Actions): pull, build, migrate, restart.
set -e
cd /var/www/pulizia-fm
git pull origin main
npm install
npm run build
npm run migrate
sudo systemctl restart pulizia
echo "Deploy complete."