#!/usr/bin/env bash
# deploy/setup-server.sh
#
# ONE-TIME setup script for a fresh Lightsail Ubuntu instance.
# Run manually on the server (not via CI/CD). After this, every future
# `git push` to main auto-deploys via GitHub Actions.
#
# USAGE:
#   1. Launch a Lightsail Ubuntu 22.04/24.04 instance, open ports 22, 80, 443.
#   2. SSH into it: ssh ubuntu@YOUR_LIGHTSAIL_IP
#   3. Edit the REPO_URL variable below to your GitHub repo URL.
#   4. Run: chmod +x setup-server.sh && ./setup-server.sh
#   5. Follow the printed next-steps at the end (editing .env, DNS, certbot).

set -e

REPO_URL="https://github.com/YOUR_USERNAME/pulizia-fm.git"   # <-- EDIT THIS
APP_DIR="/var/www/pulizia-fm"

echo "== Updating system packages =="
sudo apt-get update -y && sudo apt-get upgrade -y

echo "== Installing Node.js 20 LTS =="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "== Installing Nginx, Git, Certbot =="
sudo apt-get install -y nginx git certbot python3-certbot-nginx

echo "== Cloning repository into $APP_DIR =="
sudo mkdir -p "$APP_DIR"
sudo chown "$USER":"$USER" "$APP_DIR"
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

echo "== Installing app dependencies =="
npm ci --omit=dev

echo "== Setting up .env =="
cp .env.example .env
SESSION_SECRET=$(openssl rand -hex 32)
sed -i "s#replace_with_a_long_random_string#${SESSION_SECRET}#" .env
echo "  -> .env created with a random SESSION_SECRET."
echo "  -> IMPORTANT: edit $APP_DIR/.env now to set ADMIN_USER, ADMIN_PASS, and SITE_URL."
echo "     nano $APP_DIR/.env"
read -p "Press Enter once you've edited .env (or Ctrl+C to stop and do it now manually)..."

echo "== Creating upload/database directories =="
mkdir -p public/images/uploads database
touch public/images/uploads/.gitkeep

echo "== Running database migration =="
node scripts/migrate.js

echo "== Installing systemd service =="
sudo cp deploy/pulizia.service /etc/systemd/system/pulizia.service
sudo systemctl daemon-reload
sudo systemctl enable pulizia
sudo systemctl start pulizia

echo "== Allowing the deploy user passwordless restart of the app (for CI/CD) =="
echo "$USER ALL=(ALL) NOPASSWD: /bin/systemctl restart pulizia" | sudo tee /etc/sudoers.d/pulizia-deploy > /dev/null
sudo chmod 440 /etc/sudoers.d/pulizia-deploy

echo "== Configuring Nginx =="
sudo cp deploy/nginx.conf /etc/nginx/sites-available/pulizia
sudo ln -sf /etc/nginx/sites-available/pulizia /etc/nginx/sites-enabled/pulizia
sudo rm -f /etc/nginx/sites-enabled/default
echo "  -> IMPORTANT: edit server_name in /etc/nginx/sites-available/pulizia to your real domain."
read -p "Press Enter once you've updated the domain in the Nginx config..."
sudo nginx -t
sudo systemctl restart nginx

echo ""
echo "=================================================================="
echo " Setup complete. The app should now be running behind Nginx."
echo ""
echo " NEXT STEPS:"
echo " 1. Point your domain's DNS A record at this server's static IP."
echo " 2. Once DNS has propagated, run:"
echo "      sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "    to enable free HTTPS."
echo " 3. In your GitHub repo, add these secrets (Settings > Secrets and"
echo "    variables > Actions) so CI/CD can deploy automatically:"
echo "      LIGHTSAIL_HOST     = this server's IP or domain"
echo "      LIGHTSAIL_USER     = $USER"
echo "      LIGHTSAIL_SSH_KEY  = contents of your Lightsail .pem private key"
echo " 4. Push to main and GitHub Actions will auto-deploy from now on."
echo "=================================================================="