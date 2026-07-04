# Deploying Anchorline to AWS Lightsail (with GitHub CI/CD)

You have an AWS account, a GitHub repo, and an existing domain. Here's the full path to get this live with auto-deploy on every push to `main`.

## 1. Local setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Generate a session secret and an admin password hash:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
python scripts/set_admin_password.py "yourChosenPassword"
```

Paste both into `.env` (`SECRET_KEY`, `ADMIN_PASSWORD_HASH`), set `ADMIN_USERNAME`.

Test locally:

```bash
python app.py
# visit http://localhost:5000 and http://localhost:5000/admin
```

## 2. Push this repo to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Pushing to `main` will trigger the GitHub Actions workflow — it'll fail at the deploy step until the Lightsail server exists and secrets are set (steps below), that's expected for now.

## 3. Create the Lightsail instance

1. AWS Console → Lightsail → **Create instance**
2. Platform: Linux/Unix → Blueprint: **Ubuntu 22.04**
3. Smallest plan is enough to start ($5–7/mo tier)
4. Name it (e.g. `anchorline-web`) → Create

Once running:
- Instance → **Networking** → **Create static IP**, attach it to the instance
- Still in **Networking**, open ports **80** and **443** in the firewall

## 4. Install Docker on the server

SSH in (Lightsail's browser SSH button, or your own key):

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin nginx
sudo usermod -aG docker $USER
# log out and back in for the group change to apply
```

## 5. Set up the deploy folder on the server

```bash
mkdir -p /home/ubuntu/anchorline-fm
cd /home/ubuntu/anchorline-fm
```

Copy `docker-compose.yml` and `.env` (filled in with real values) from your local machine to this folder:

```bash
scp -i YourLightsailKey.pem docker-compose.yml .env ubuntu@<STATIC_IP>:/home/ubuntu/anchorline-fm/
```

Create the persistent data folders:

```bash
mkdir -p data uploads
```

## 6. Add GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `LIGHTSAIL_HOST` | Your Lightsail static IP |
| `LIGHTSAIL_USER` | `ubuntu` |
| `LIGHTSAIL_SSH_KEY` | Contents of your Lightsail private key (.pem file) |

`GITHUB_TOKEN` is provided automatically — no need to add it.

If your GitHub repo/package is **private**, the server also needs to authenticate to pull images outside of CI (e.g. for a manual `docker compose pull`). For CI-driven deploys this isn't required since the workflow logs in for you.

## 7. First deploy

Push to `main` (or re-run the failed workflow from the Actions tab). GitHub Actions will:
1. Build the Docker image
2. Push it to `ghcr.io/<your-username>/<your-repo>`
3. SSH into your Lightsail server, pull the new image, and restart the container

Check it worked:

```bash
ssh -i YourLightsailKey.pem ubuntu@<STATIC_IP>
docker ps
curl http://localhost:5000
```

## 8. Nginx reverse proxy (serve on port 80/443)

```bash
sudo nano /etc/nginx/sites-available/anchorline
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/anchorline /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 9. Point your existing domain at Lightsail

At your domain registrar's DNS settings:
- **A record**: `@` → `<your Lightsail static IP>`
- **A record**: `www` → `<your Lightsail static IP>`

DNS propagation can take minutes to a few hours.

## 10. Free HTTPS via Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 11. Day-to-day admin use

Go to `https://yourdomain.com/admin`, log in, and add/hide/delete careers roles and posts. Changes appear on the live site immediately — no redeploy needed.

## 12. From now on: just `git push`

Every push to `main` automatically builds and redeploys. No manual SSH steps needed after initial setup.

## Backups

The database is a single file at `data/anchorline.db` on the server:

```bash
scp -i YourLightsailKey.pem ubuntu@<STATIC_IP>:/home/ubuntu/anchorline-fm/data/anchorline.db ./backup-$(date +%F).db
```

## Note on S3

Per your setup, uploaded post images are stored on the server's local disk (`uploads/` volume), not S3. This is simpler and works fine at this scale — the `uploads/` folder is backed up the same way as the database if you want extra safety:

```bash
scp -r -i YourLightsailKey.pem ubuntu@<STATIC_IP>:/home/ubuntu/anchorline-fm/uploads ./uploads-backup-$(date +%F)
```