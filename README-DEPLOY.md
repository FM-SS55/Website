# Pulizia FM Services

Multi-page Node.js/Express website (matching the structure of puliziafm.com,
with rewritten content) plus a built-in admin panel for managing banners,
services, clients, and blog posts — no code changes needed to update content.

- **Backend:** Node.js + Express + SQLite + EJS
- **Admin panel:** single admin login, session-based, image uploads via Multer
- **Deployment:** AWS Lightsail (Ubuntu) + Nginx + systemd
- **CI/CD:** GitHub Actions — push to `main` auto-deploys

---

## 1. Project Structure

pulizia-fm/
├── .github/workflows/deploy.yml   # CI/CD pipeline
├── config/db.js                   # SQLite connection
├── database/                      # SQLite file lives here (gitignored)
├── middleware/auth.js             # admin session guard
├── models/                        # Banner, Service, Client, BlogPost, Admin
├── routes/                        # pages.js (public), admin.js, api.js
├── scripts/migrate.js             # creates tables + seeds admin user
├── views/
│   ├── partials/                  # header, nav, footer, admin-sidebar
│   ├── public/                    # home, about, services, clients, blog, contact, 404
│   └── admin/                     # login, dashboard, banners, services, clients, blog, messages
├── public/
│   ├── css/ (style.css, admin.css)
│   ├── js/ (main.js)
│   └── images/uploads/            # admin-uploaded images (gitignored)
├── deploy/                        # nginx.conf, pulizia.service, setup-server.sh
├── server.js
├── package.json
└── .env.example

---

## 2. Local Development

**Requirements:** Node.js 18+ and npm.

git clone https://github.com/YOUR_USERNAME/pulizia-fm.git
cd pulizia-fm
npm install

cp .env.example .env
# Open .env and set at minimum: ADMIN_USER, ADMIN_PASS, SESSION_SECRET
# Generate a secret with: openssl rand -hex 32

npm run migrate   # creates database/pulizia.sqlite + admin user + starter content
npm run dev        # starts on http://localhost:3000 with auto-reload (nodemon)

Visit:
- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin/login` (use the `ADMIN_USER` / `ADMIN_PASS` from `.env`)

To change the admin password later: edit `ADMIN_PASS` in `.env`, delete the
existing row from the `admins` table (or just change `ADMIN_USER` to force a
new row), then re-run `npm run migrate`. (A "change password" screen inside
the admin panel can be added later using `Admin.updatePassword()`, which
already exists in `models/Admin.js`.)

---

## 3. Using the Admin Panel

Log in at `/admin/login`, then from the sidebar:

- **Banners** — the homepage hero slider. Add/edit/delete, reorder with
  "Sort Order" (lower number = shown first), toggle "Active" to hide a
  banner without deleting it.
- **Services** — the 9 service cards + their individual pages
  (`/services/:slug`). Editing the slug changes the page URL.
- **Clients** — the "Our Valued Clients" chips.
- **Blog Posts** — draft with "Published" unchecked, then check it when
  ready to go live.
- **Messages** — everything submitted through the public Contact Us form.

Every change appears on the live site immediately — no rebuild or redeploy
needed.

---

## 4. First-Time Deployment (AWS Lightsail)

1. **Create the Lightsail instance:** Ubuntu 22.04 or 24.04, any plan size.
   In the Lightsail networking tab, open ports **22 (SSH), 80 (HTTP), 443 (HTTPS)**.

2. **Push this project to GitHub** (if you haven't already):
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pulizia-fm.git
   git push -u origin main

3. **SSH into the Lightsail instance** and run the one-time setup script:
   ssh ubuntu@YOUR_LIGHTSAIL_IP
   git clone https://github.com/YOUR_USERNAME/pulizia-fm.git /tmp/pulizia-fm
   cd /tmp/pulizia-fm
   chmod +x deploy/setup-server.sh
   ./deploy/setup-server.sh

   This installs Node, Nginx, Certbot, clones the real copy into
   `/var/www/pulizia-fm`, sets up `.env`, runs the DB migration, starts the
   app via systemd, and configures Nginx. Follow the prompts (it'll pause
   twice: once to edit `.env`, once to set your domain in the Nginx config).

4. **Point your domain at the server:** create an A record pointing to the
   Lightsail static IP (attach a static IP in Lightsail first so it doesn't
   change on reboot).

5. **Enable HTTPS:**
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

6. **Add GitHub Actions secrets** (repo → Settings → Secrets and variables →
   Actions → New repository secret):

   | Secret | Value |
   |---|---|
   | `LIGHTSAIL_HOST` | Your server's IP or domain |
   | `LIGHTSAIL_USER` | `ubuntu` |
   | `LIGHTSAIL_SSH_KEY` | The full contents of your Lightsail `.pem` private key file |

At this point the site is live and every future `git push` to `main`
auto-deploys.

---

## 5. Ongoing Deployment (CI/CD)

Just push to `main`:

git add .
git commit -m "Update services page copy"
git push

GitHub Actions will SSH into the server, pull the latest code, install
dependencies, run any new migrations, and restart the app —
usually done in under a minute. Watch progress under the **Actions** tab
of your GitHub repo.

The SQLite database and uploaded images live outside what git tracks, so
deploys never overwrite content you've added through the admin panel.

**Manual redeploy without a new commit:** go to the Actions tab → "Deploy to
Lightsail" → "Run workflow".

---

## 6. Useful Server Commands

sudo systemctl status pulizia     # is the app running?
sudo systemctl restart pulizia    # manual restart
sudo journalctl -u pulizia -f     # live application logs
sudo nginx -t                     # test Nginx config after edits
sudo systemctl restart nginx      # apply Nginx changes

---

## 7. Backing Up

The only things that matter for backup are:
- `database/pulizia.sqlite` — all content (banners, services, clients, posts, messages, admin login)
- `public/images/uploads/` — uploaded images

Copy both off the server periodically, e.g.:
scp ubuntu@YOUR_LIGHTSAIL_IP:/var/www/pulizia-fm/database/pulizia.sqlite ./backup/
scp -r ubuntu@YOUR_LIGHTSAIL_IP:/var/www/pulizia-fm/public/images/uploads ./backup/