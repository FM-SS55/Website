# Mandafia Services — mandafiaservices.com

Website, admin panel and API for Mandafia Services. One Node.js app serves everything:

| URL | What |
|---|---|
| `/` | public website (React + Vite) |
| `/admin/` | admin panel (manage banners, services, clients, blog, messages) |
| `/api/*` | REST API (Express + SQLite) |

```
frontend/web      public site          frontend/admin   admin panel
frontend/shared   code used by both    backend          Express API + SQLite
scripts/package-cpanel.js              builds the upload bundle for GoDaddy
```

Business details (email, phone, address) are in **`frontend/web/src/config/site.js`**. Phone and address are empty and hidden until you fill them in.

## Local development (Node 18+)

```bash
npm install
cp backend/.env.example backend/.env     # set ADMIN_USER / ADMIN_PASS
npm run dev                               # api :3000, site :5173, admin :5174/admin/
```

## Deploy to GoDaddy Economy (cPanel + Node.js)

### 1. Build the bundle on your computer
```bash
npm install
npm run package:cpanel
```
Open the new `dist-cpanel/` folder, select everything **inside** it and zip it as `mandafia.zip` (`package.json` must be at the top of the zip).

### 2. Upload
cPanel → **File Manager**
1. Create `/home/USER/mandafia-app` (outside `public_html`) → upload `mandafia.zip` → **Extract**.
2. Create `/home/USER/mandafia-data/uploads`. The database and uploaded images live here so updates never touch them.

### 3. Create the Node.js app
cPanel → **Setup Node.js App** → **Create Application**
- Node.js version: highest available (20 or 22 preferred)
- Application mode: **Production**
- Application root: `mandafia-app`
- Application URL: `mandafiaservices.com`
- Application startup file: `src/server.js`

Add environment variables:

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | 32+ random characters (the app refuses to start without it) |
| `ADMIN_USER` | your admin username |
| `ADMIN_PASS` | strong password, 10+ characters (used on first start) |
| `DB_PATH` | `/home/USER/mandafia-data/mandafia.sqlite` |
| `UPLOAD_DIR` | `/home/USER/mandafia-data/uploads` |
| `SITE_URL` | `https://mandafiaservices.com` |

Click **Run NPM Install**, then **Start App**. Tables and the admin account are created automatically on first start.

### 4. HTTPS (required)
cPanel → **SSL/TLS Status** → run **AutoSSL** for mandafiaservices.com (the free SSL is included). Then in **Domains**, turn on **Force HTTPS Redirect**. The admin login cookie only works over HTTPS.

### 5. Verify
- `https://mandafiaservices.com/api/health` → `{"status":"ok"}`
- `https://mandafiaservices.com/` → website
- `https://mandafiaservices.com/admin/` → log in

### 6. Email
Create `info@mandafiaservices.com` in cPanel → **Email Accounts**. Contact-form messages are stored in the admin panel (Messages); they are not emailed.

## Updating later
Re-run `npm run package:cpanel`, extract the new zip over `mandafia-app` (overwrite), press **Run NPM Install** only if dependencies changed, then **Restart**. Data in `mandafia-data` is untouched.

## Changing the admin password
Set `ADMIN_PASS` to the new value and `ADMIN_RESET_PASSWORD=true`, restart the app once, then delete `ADMIN_RESET_PASSWORD`.

## Backups
Download `/home/USER/mandafia-data/` (the `.sqlite` file and `uploads/`) regularly, or use cPanel → **Backup**. Those are the only data that matter.

## Troubleshooting
- **App won't start**: read `stderr.log` in the app folder. A message about `SESSION_SECRET` or `ADMIN_PASS` means a variable is missing or too weak.
- **`npm install` fails on `sqlite3`**: choose a different Node.js version in the app settings and retry; otherwise contact GoDaddy support.
- **Can't log in**: make sure you are on `https://`.